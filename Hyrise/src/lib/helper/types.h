// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#ifndef SRC_LIB_HELPER_TYPES_H_
#define SRC_LIB_HELPER_TYPES_H_

#include <cstdint>
#include <string>
#include <limits>
#include <memory>
#include <vector>

class AbstractResource;
class AbstractTable;
class AbstractIndex;
class AbstractHashTable;
class Store;
class MutableVerticalTable;
class PointerCalculator;

namespace hyrise {

namespace tx {
typedef int64_t transaction_id_t;
static const transaction_id_t START_TID = 1;
static const transaction_id_t MAX_TID = std::numeric_limits<transaction_id_t>::max();
}

namespace insertonly {
static const tx::transaction_id_t VISIBLE = 0;
static const std::string VALID_TO_COL_ID = "$valid_to";
static const std::string VALID_FROM_COL_ID = "$valid_from";
}

namespace access {
class AbstractExpression;
typedef std::unique_ptr<AbstractExpression> expression_uptr_t;
}

namespace storage {
class SimpleStore;

typedef std::shared_ptr<AbstractResource> aresource_ptr_t;
typedef std::shared_ptr<const AbstractResource> c_aresource_ptr_t;

typedef std::shared_ptr<AbstractTable> atable_ptr_t;
typedef std::shared_ptr<const AbstractTable> c_atable_ptr_t;

typedef std::shared_ptr<AbstractIndex> aindex_ptr_t;
typedef std::shared_ptr<const AbstractIndex> c_aindex_ptr_t;

typedef std::shared_ptr<AbstractHashTable> ahashtable_ptr_t;
typedef std::shared_ptr<const AbstractHashTable> c_ahashtable_ptr_t;

typedef std::shared_ptr<MutableVerticalTable> vtable_ptr_t;
typedef std::shared_ptr<const MutableVerticalTable> c_vtable_ptr_t;

typedef std::shared_ptr<Store> store_ptr_t;
typedef std::shared_ptr<const Store> c_store_ptr_t;

typedef std::shared_ptr<PointerCalculator> calc_ptr_t;
typedef std::shared_ptr<const PointerCalculator> c_calc_ptr_t;

typedef std::shared_ptr<SimpleStore> simplestore_ptr_t;
typedef std::shared_ptr<const SimpleStore> c_simplestore_ptr_t;

typedef int64_t hyrise_int_t;
typedef float hyrise_float_t;
typedef std::string hyrise_string_t;

typedef uint32_t value_id_t;
typedef unsigned char table_id_t;

typedef size_t pos_t;
typedef size_t field_t;

typedef std::string field_name_t;
typedef std::vector<field_name_t> field_name_list_t;

typedef std::vector<pos_t> pos_list_t;
typedef std::vector<field_t> field_list_t;
}

// constraints
static_assert(std::is_same<tx::transaction_id_t, storage::hyrise_int_t>::value,
              "transaction_id_t and hyrise_int_t need to be of the same type");
}



#endif
