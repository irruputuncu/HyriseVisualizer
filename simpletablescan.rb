#module for predicate type constants
module SCAN_TYPE
	EQ = 0
	LT = 1
	GT = 2
	BETWEEN = 3
	COMPOUND = 4
	NEG = 5
	AND = 6
	OR = 7
	NOT = 8
	MULTI_EQ = 9
end

#module for container type constants
module V_TYPE
	INTEGER = 0
	FLOAT = 1
	STRING = 2
end


class SimpleTableScanOperator < Operator
	def initialize()
		super()
		initializeWithType("SimpleTableScan")
		@predicates = Array.new()
	end

	def addPredicate(type=SCAN_TYPE::EQ,in_type=0,f="",vtype=V_TYPE::INTEGER,value=0)
		@predicates.push({"type"=>type,"in"=>in_type,"f"=>f,"vtype"=>vtype,"value"=>value})
	end

	def to_json(*a)
		{"type"=>@type, "predicates"=>@predicates}.to_json
	end

end
