class TableLoadOperator < Operator
	def initialize()
		super()
		initializeWithType("TableLoad")
	end

	def setTableName(tableName = "")
		@tableName = tableName
	end

	def setTableFileName(tableFileName = "")
		@tableFileName = tableFileName
	end

	def setTableHeaderFileName(tableHeaderFileName = "")
		@tableHeaderFileName = tableHeaderFileName
	end

	def to_json(*a)
		{"type"=>@type, "table"=>@tableName, "filename"=>@tableFileName, "header"=>@tableHeaderFileName}.to_json
	end

end
