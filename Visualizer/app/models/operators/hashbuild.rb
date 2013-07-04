class HashBuildOperator < Operator

	def initialize
		super
		@fields = Array.new
		initializeWithType("HashBuild")
	end

	def addField(field)
		@fields << field
	end

	def as_json(*a)
		{"type" => @type, "fields" => @fields}
	end

end
