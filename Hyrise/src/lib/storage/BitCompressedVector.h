// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#ifndef SRC_LIB_STORAGE_BITCOMPRESSEDVECTOR_H_
#define SRC_LIB_STORAGE_BITCOMPRESSEDVECTOR_H_

#include <math.h>
#include <stdint.h>
#include <cstring>

#include <mutex>
#include <string>
#include <stdexcept>

#include <storage/AbstractAttributeVector.h>
#include <storage/BaseAttributeVector.h>

#ifndef WORD_LENGTH
#define WORD_LENGTH 64
#endif

template<typename T>
class BitCompressedVectorIterator;

/*
  can only save positive numbers
*/
//template <typename T, typename Allocator = StrategizedAllocator<T, MemalignStrategy<4096>> >
template <typename T, typename Allocator = StrategizedAllocator<T, MallocStrategy> >
class BitCompressedVector : public BaseAllocatedAttributeVector<BitCompressedVector<T, Allocator>, Allocator> {

  // Typedef for the data
  typedef uint64_t storage_t;
  typedef std::vector<uint64_t> bit_size_list_t;

  // Number of bits per storage element
  const static uint64_t _bit_width = sizeof(storage_t)  * 8;

  // Pointer to the data, aligned to 16 bytes
  storage_t *_data __attribute__((aligned(16)));

  // Number of tuples
  uint64_t _size;

  /* Variables for Data handling */

  // number of allocated blocks
  uint64_t _allocatedBlocks;

  // number of columns in this block
  uint64_t _columns;

  // The bits used for each column
  bit_size_list_t _bits;

public:

  typedef T value_type;
  typedef BitCompressedVector<T, Allocator> vector_type;

  BitCompressedVector(size_t columns,
                      size_t rows,
                      std::vector<uint64_t> bits): _data(nullptr), _size(0), _allocatedBlocks(0), _columns(columns), _bits(bits) {
    reserve(rows);
  }

  virtual ~BitCompressedVector() {
    Allocator::Strategy::deallocate(_data, _allocatedBlocks * sizeof(storage_t));
  }

  void *data() {
    throw std::runtime_error("Direct data access not allowed");
  }
  void setNumRows(size_t s) {
    throw std::runtime_error("Direct data access not allowed");
  }

  T get(size_t column, size_t row) const {
    checkAccess(column, row);

    T result;
    register auto offset = _blockOffset(row);
    register auto colOffset = _offsetForColumn(column);
    register auto block = _blockPosition(row) + (offset + colOffset) / _bit_width;

    // Adjust the column offset to the new block
    colOffset = (offset + colOffset) % _bit_width;

    uint64_t bounds = _bit_width - colOffset;
    register uint64_t baseMask = (1ull << _bits[column]) - 1ull;

    result = (_data[block] >> colOffset) & baseMask;

    if (bounds < _bits[column]) {
      colOffset = _bits[column] - bounds;
      baseMask = (1ull << colOffset) - 1ull;
      result |= (baseMask & _data[block + 1]) << bounds;
    }
    return result;
  }

  void set(size_t column, size_t row, T value) {
    checkAccess(column, row);

    register auto offset = _blockOffset(row);
    register auto colOffset = _offsetForColumn(column);
    register auto block = _blockPosition(row) + (offset + colOffset) / _bit_width;

    // Adjust the column offset to the new block
    colOffset = (offset + colOffset) % _bit_width;

    register uint64_t bounds = _bit_width - colOffset;
    register uint64_t baseMask = (1ull << _bits[column]) - 1ull;
    register uint64_t mask = ~(baseMask << colOffset);

    _data[block] &= mask;
    _data[block] |= ((uint64_t) value & baseMask) << colOffset;

    if (bounds < _bits[column]) {
      mask = ~(baseMask >> bounds);
      _data[block + 1] &= mask;
      _data[block + 1] |= ((uint64_t) value & baseMask) >> bounds;
    }
  }

  /*
    Reserve memory for the given number of rows. memory will only be
    allocated if the number of rows requires a larger number of blocks
    than before and it can only be incremented.
   */
  void reserve(size_t rows) {
    if (rows > 0 && _blocks(rows) > _blocks(_allocatedBlocks)) {
      // Allocate the new memory, copy the old memory and swap the
      // data
      assert(_blocks(rows) > 0);
      storage_t *newMemory = _allocate(_blocks(rows));
      if (_allocatedBlocks > 0)
        std::memcpy(newMemory, _data, _allocatedBlocks * sizeof(storage_t));

      std::swap(_data, newMemory);

      // Only deallocate if there was something allocated
      if (newMemory != nullptr)
        Allocator::Strategy::deallocate(newMemory, _allocatedBlocks * sizeof(storage_t));

      // set new allocarted blocks
      _allocatedBlocks = _blocks(rows);
    }
  }

  /*
    Immediately resizes the data vector to 0 and frees the memory
    allocated by the vector
   */
  void clear() {
    _size = 0;
    Allocator::Strategy::deallocate(_data, _allocatedBlocks * sizeof(storage_t));
    _data = nullptr;
  }

  size_t size() {
    return _size;
  }

  /*
    Allocate memory for size rows and increase the size of the data
    container to size
   */
  void resize(size_t size) {
    if (size == 0) return;
    reserve(size);
    _size = size;
  }

  inline uint64_t capacity() {
    return (_allocatedBlocks * _bit_width) / _tupleWidth();
  }

  void rewriteColumn(const size_t column, const size_t bits) {
    //uint64_t oldBits = _bits[column];
    _bits[column] = bits;
    if (_size > 0) {
      throw std::runtime_error("Bad rewrite");
    }
  }

  std::shared_ptr<BaseAttributeVector<T>> copy();

private:
  inline void checkAccess(const size_t& column, const size_t& rows) const {
#ifdef EXPENSIVE_ASSERTIONS
    if (column >= _columns) {
      throw std::out_of_range("Trying to access column '"
                              + std::to_string(column) + "' where only '"
                              + std::to_string(_columns) + "' available");
    }
    if (rows >= _size) {
      throw std::out_of_range("Trying to access rows '"
                              + std::to_string(rows) + "' where only '"
                              + std::to_string(_size) + "' available");
    }
#endif
  }

  /*
    Calculates the offset for a given column from the begining of the
    row in bits
   */
  inline uint64_t _offsetForColumn(uint64_t column) const {
    uint64_t offset = 0;
    for (uint64_t i = 0; i < column; ++i)
      offset += _bits[i];
    return offset;
  }

  /*
    Calculates the starting block for the row
   */
  inline uint64_t _blockPosition(uint64_t row) const {
    return (_tupleWidth() * row) / _bit_width;
  }

  /*
    Calculates the offset of the row inside the block
   */
  inline uint64_t _blockOffset(uint64_t row) const {
    return (_tupleWidth() * row) % _bit_width;
  }

  // Return the number of required blocks for the number of rows given
  // in the parameter
  inline uint64_t _blocks(uint64_t rows) const {
    return ((rows * _tupleWidth()) + _bit_width - 1) / _bit_width;
  }

  /*
    Calculate the number of required bits for the tuple
   */
  inline uint64_t _tupleWidth() const {
    uint64_t sum = 0;
    if (sum == 0) {
      for (uint64_t i = 0; i < _bits.size(); ++i)
        sum += _bits[i];
    }
    return sum;
  }

  /*
  * Allocate memory given by the number of blocks
  */
  inline storage_t *_allocate(uint64_t numBlocks) {

    auto data = static_cast<storage_t *>(Allocator::Strategy::allocate(numBlocks * sizeof(storage_t)));
    if (data == nullptr) {
      Allocator::Strategy::deallocate(data, numBlocks * sizeof(storage_t));
      throw std::bad_alloc();
    }
    std::memset(data, 0, numBlocks * sizeof(storage_t));
    return data;
  }

};



template <typename T, typename Allocator>
std::shared_ptr<BaseAttributeVector<T>>  BitCompressedVector<T, Allocator>::copy() {
  std::shared_ptr<BitCompressedVector> b = std::make_shared<BitCompressedVector>(_columns, _size, _bits);
  b->resize(_size);
  std::memcpy(b->_data, _data, _allocatedBlocks * sizeof(storage_t));
  return b;
}

#endif  // SRC_LIB_STORAGE_BITCOMPRESSEDVECTOR_H_
