class MetaDataOperator < Operator
	def initialize()
		super()
		initializeWithType("MetaData")
		@inputs = Array.new
	end

	def addInput(tablename) 
		@inputs << tablename
	end

	def to_json(*a)
		#build the json structure
		result = {"type"=>@type, "input"=>@inputs}

		return result.to_json
	end

end
