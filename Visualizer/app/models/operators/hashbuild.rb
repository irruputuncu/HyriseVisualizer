class HashBuildOperator < Operator

	def initialize
		super
		@fields = Array.new
		@functions = Array.new
		initializeWithType("HashBuild")
	end

	def addField(field)
		@fields << field
	end

	def as_json(*a)
		{"type" => @type, "fields" => @fields, "functions" => @functions}
	end

end
