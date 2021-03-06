// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#ifndef SRC_LIB_ACCESS_SIMPLETABLESCAN_H_
#define SRC_LIB_ACCESS_SIMPLETABLESCAN_H_

#include "access/system/PlanOperation.h"
#include "access/expressions/pred_SimpleExpression.h"

namespace hyrise {
namespace access {

class SimpleTableScan : public _PlanOperation {
public:
  SimpleTableScan();
  virtual ~SimpleTableScan();

  void setupPlanOperation();
  void executePlanOperation();
  void executePositional();
  void executeMaterialized();
  static std::shared_ptr<_PlanOperation> parse(Json::Value &data);
  const std::string vname();
  void setPredicate(SimpleExpression *c);

private:
  SimpleExpression *_comparator;
};

}
}

#endif  // SRC_LIB_ACCESS_SIMPLETABLESCAN_H_
