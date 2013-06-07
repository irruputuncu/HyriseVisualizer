// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#include "access/MetaData.h"

#include "access/QueryParser.h"
#include "access/BasicParser.h"

#include "io/StorageManager.h"

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

void MetaData::executePlanOperation() {
 
  TableBuilder::param_list list;
  list.append().set_type("STRING").set_name("table");
  list.append().set_type("STRING").set_name("column");
  list.append().set_type("INTEGER").set_name("data_type"); //output as string?
  auto meta_data = TableBuilder::build(list);

  size_t row_count = 0;

  for (size_t i = 0; i < input.numberOfTables(); ++i) {  //iterate over all input tables
    
    const auto& in = input.getTable(i);
    const auto& loaded_tables = StorageManager::getInstance()->all();
    std::string tablename = "unknown/temporary";

    for (const auto& table: loaded_tables) {
      if (table.second == in) {
        tablename = table.first;
        break;
      }
    }

    for (field_t j = 0; j != in->columnCount(); ++j) {
      meta_data->resize(meta_data->size() + 1);
      meta_data->setValue<hyrise_string_t>("table", row_count, tablename);
      meta_data->setValue<hyrise_string_t>("column", row_count, in->metadataAt(j)->getName());
      meta_data->setValue<hyrise_int_t>("data_type", row_count, in->metadataAt(j)->getType());

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