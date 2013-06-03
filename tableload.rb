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
		#build the json structure
		result = {"type"=>@type, "table"=>@tableName, "filename"=>@tableFileName}
		
		if not @tableHeaderFileName.nil?
			result["header"] = @tableHeaderFileName
		end

		return result.to_json
	end

end
