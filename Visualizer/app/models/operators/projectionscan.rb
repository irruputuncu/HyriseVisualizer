class ProjectionScanOperator < Operator

	def initialize
		super
		@fields = Array.new
		@inputs = Array.new
		initializeWithType("ProjectionScan")
	end

	def addInput(table) 
		@inputs << table
	end

	def addField(field)
		@fields << field
	end

	def as_json(*a)
		{"type" => @type, "fields" => @fields, "input" => @inputs}
	end

end
