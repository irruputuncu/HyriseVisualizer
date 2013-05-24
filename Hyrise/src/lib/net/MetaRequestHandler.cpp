// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#include "net/MetaRequestHandler.h"

#include <sstream>
#include <string>

#include "json.h"
#include "net/AsyncConnection.h"
#include "io/StorageManager.h"
#include "storage/AbstractTable.h"

namespace hyrise {
namespace net {

bool MetaRequestHandler::registered =
    Router::registerRoute<MetaRequestHandler>("/tables/");

MetaRequestHandler::MetaRequestHandler(AbstractConnection *data)
    : _connection_data(data) {}

std::string MetaRequestHandler::name() {
  return "MetaRequestHandler";
}

const std::string MetaRequestHandler::vname() {
  return "MetaRequestHandler";
}

std::string MetaRequestHandler::constructResponse() {
  const auto &storageManager = StorageManager::getInstance();
  Json::Value result;
  auto &tables = result["tables"];
  for (const auto & tableName: storageManager->getTableNames()) {
    auto &table = tables[tableName];
    auto &columns = table["columns"];
    auto t = storageManager->getTable(tableName);
    table["columnCount"] = t->columnCount();
    for (field_t i = 0; i != t->columnCount(); i++) {
      columns[t->metadataAt(i)->getName()] = t->metadataAt(i)->getType();
    }
  }
  Json::StyledWriter writer;
  return writer.write(result);
}

void MetaRequestHandler::operator()() {
  std::string response(constructResponse());
  _connection_data->respond(response);
}
}
}
