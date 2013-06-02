require "./operator"
require "./tableload.rb"
require "./simpletablescan.rb"

def hashForOperators(operators=[])
	hash = {}
	for operator in operators
		hash[operator.id] = operator
	end

	return hash
end

def buildJSONForRootNode(rootOperator)
	nodes = rootOperator.edgeArray()
	resultHash = {}
	operatorsHash = {}
	currentID = 0
	

	#build the operators
	for operator in nodes
		operator.id = currentID
		operatorsHash[operator.id] = operator
		currentID += 1
	end

	resultHash['operators'] = operatorsHash

	#ids are assigned, now loop one more time to get the right edges
	edges = Array.new()
	for operator in nodes
		edges = edges.concat(operator.edges())
	end
	resultHash['edges'] = edges

	puts resultHash.to_json()
end

=begin
op1 = Operator.new(0,"Project #0")
op2 = Operator.new(1,"Natural join #0")
op3 = Operator.new(2,"Project #1")
op4 = Operator.new(3,"Project #2")
op5 = Operator.new(4,"Select #0")
op6 = Operator.new(5,"Natural join #1")
op7 = Operator.new(6,"Select #1")
op8 = Operator.new(7,"Select #2")
op9 = Operator.new(8,"Select #3")

op1.addEdgeTo(op2)
op2.addEdgeTo(op3)
op2.addEdgeTo(op4)
op3.addEdgeTo(op5)
op5.addEdgeTo(op6)
op6.addEdgeTo(op7)
op6.addEdgeTo(op8)
op4.addEdgeTo(op9)

buildJSONForRootNode(op1)

=end

op1 = TableLoadOperator.new()

#set the values for the table load
op1.setTableName("table name")
op1.setTableFileName("filename.data")
op1.setTableHeaderFileName("header.txt")

op2 = SimpleTableScanOperator.new()
op2.addPredicate(SCAN_TYPE::OR)
op2.addPredicate(SCAN_TYPE::LT,0,"NAME1",V_TYPE::INTEGER,330)
op2.addPredicate(SCAN_TYPE::LT,0,"NAME2",V_TYPE::INTEGER,300)

op1.addEdgeTo(op2)

buildJSONForRootNode(op1)

