// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#ifndef SRC_LIB_ACCESS_METADATA_H_
#define SRC_LIB_ACCESS_METADATA_H_

#include "access/PlanOperation.h"

namespace hyrise {
namespace access {

class MetaData : public _PlanOperation {
public:
  MetaData();
  virtual ~MetaData();

  void setupPlanOperation();
  void executePlanOperation();
  static std::shared_ptr<_PlanOperation> parse(Json::Value &data);
  const std::string vname();
};

}
}

#endif  // SRC_LIB_ACCESS_METADATA_H_
