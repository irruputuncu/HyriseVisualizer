// Copyright (c) 2012 Hasso-Plattner-Institut fuer Softwaresystemtechnik GmbH. All rights reserved.
#ifndef SRC_LIB_ACCESS_SORTSCAN_H_
#define SRC_LIB_ACCESS_SORTSCAN_H_

#include <access/system/PlanOperation.h>

namespace hyrise {
namespace access {

class SortScan : public _PlanOperation {
public:
  virtual ~SortScan();

  void executePlanOperation();
  static std::shared_ptr<_PlanOperation> parse(Json::Value &data);
  const std::string vname();
  void setSortField(const unsigned s);

private:
  unsigned _sort_field;
};

}
}

#endif  // SRC_LIB_ACCESS_SORTSCAN_H_
