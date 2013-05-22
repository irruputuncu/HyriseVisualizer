require "./operator"

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
	for operator in nodes
		operator.id = currentID
		operatorsHash[operator.id] = operator
		currentID += 1
	end

	resultHash['operators'] = operatorsHash

	puts resultHash.to_json()
end

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

