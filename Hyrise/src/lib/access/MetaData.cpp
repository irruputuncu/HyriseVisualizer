// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#include "access/MetaData.h"

#include "access/QueryParser.h"
#include "access/BasicParser.h"

#include "storage/storage_types.h"
#include "storage/AbstractTable.h"
#include "storage/TableBuilder.h"
#include "storage/ColumnMetadata.h"
#include "storage/Table.h"

#include <iostream>

namespace hyrise {
namespace access {

namespace {
  auto _ = QueryParser::registerPlanOperation<MetaData>("MetaData");
}

MetaData::MetaData() {
}

MetaData::~MetaData() {
}

void MetaData::setupPlanOperation() {
  computeDeferredIndexes();
}

// void MetaData::executePlanOperation() {
 
//   TableBuilder::param_list list;
//   list.append().set_type("STRING").set_name("table");
//   list.append().set_type("STRING").set_name("column");
//   list.append().set_type("INTEGER").set_name("data_type"); //output as string?
//   auto meta_data = TableBuilder::build(list);

//   size_t row_count = 0;

//   for (size_t i = 0; i < input.numberOfTables(); ++i) {  //iterate over all input tables
    
//     const auto& in = input.getTable(i);

//     for (field_t j = 0; j != in->columnCount(); ++j) {
//       meta_data->resize(meta_data->size() + 1);
//       meta_data->setValue<std::string>("table", row_count, "tablename"); //where to get table name?
//       meta_data->setValue<std::string>("column", row_count, in->metadataAt(j)->getName());
//       meta_data->setValue<int>("data_type", row_count, in->metadataAt(j)->getType());

//       ++row_count;
//     }
//   }

//   addResult(meta_data);
// }

void MetaData::executePlanOperation() {

  std::vector<const ColumnMetadata *> output_metadata;
  output_metadata.push_back(ColumnMetadata::metadataFromString("STRING", "table"));
  output_metadata.push_back(ColumnMetadata::metadataFromString("STRING", "column"));
  output_metadata.push_back(ColumnMetadata::metadataFromString("INTEGER", "data_type"));
  auto meta_data = std::make_shared<Table<>>(&output_metadata, nullptr, 0, false, 0, 0, false);

  size_t row_count = 0;

  for (size_t i = 0; i < input.numberOfTables(); ++i) {  //iterate over all input tables
    
    const auto& in = input.getTable(i);

    meta_data->resize(meta_data->size() + in->columnCount());
    const auto &oavs = meta_data->getAttributeVectors(0);
    auto meta_table_vector = std::dynamic_pointer_cast<FixedLengthVector<std::string>>(oavs.at(0).attribute_vector);
    
    //oavs = meta_data->getAttributeVectors(0);
    auto meta_column_vector = std::dynamic_pointer_cast<FixedLengthVector<std::string>>(oavs.at(0).attribute_vector);
    
    //oavs = meta_data->getAttributeVectors(0);
    auto meta_type_vector = std::dynamic_pointer_cast<FixedLengthVector<value_id_t>>(oavs.at(0).attribute_vector);

    for (field_t j = 0; j != in->columnCount(); ++j) {
      meta_table_vector->set(0, row_count, "tablename");
      meta_column_vector->set(0, row_count, in->metadataAt(j)->getName());
      meta_type_vector->set(0, row_count, in->metadataAt(j)->getType());

      ++row_count;
    }
  }

  addResult(meta_data);
}

std::shared_ptr<_PlanOperation> MetaData::parse(Json::Value &data) {
  std::shared_ptr<_PlanOperation> p = BasicParser<MetaData>::parse(data);
  return p;
}

const std::string MetaData::vname() {
  return "MetaData";
}

}
}