require "./operator"
require "./tableload.rb"
require "./simpletablescan.rb"

require 'net/http'

HYRISE_DEFAULT_URL = URI('http://localhost:5000/')

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

	return resultHash.to_json()
end

def query(data, url = HYRISE_DEFAULT_URL)
	req = Net::HTTP::Post.new("url.path")
	req.set_form_data({:query=> data, :limit => 0})

	response = Net::HTTP.new(url.host, url.port).start {|http|
      http.read_timeout = nil
      http.request(req)
    }

    response_body = response.body
    json = JSON.parse(response_body)

    jj json
    json
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
op1.setTableName("companies")
op1.setTableFileName("tables/companies.tbl")

op2 = SimpleTableScanOperator.new()
op2.addPredicate(SCAN_TYPE::OR)
op2.addPredicate(SCAN_TYPE::GT,0,"company_id",V_TYPE::INTEGER,2)
op2.addPredicate(SCAN_TYPE::EQ,0,"company_name",V_TYPE::STRING,"Microsoft")

op1.addEdgeTo(op2)

json = buildJSONForRootNode(op1)

puts json
#POST the JSON to the HYRISE server that needs to be running
#query(json)

