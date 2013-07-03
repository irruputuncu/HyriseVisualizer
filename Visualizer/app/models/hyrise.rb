require 'net/http'

require 'operators/operator.rb'
require 'operators/metadata.rb'
require 'operators/tableload.rb'
require 'operators/projectionscan.rb'
require 'operators/simpletablescan.rb'
require 'operators/groupbyscan.rb'

class Hyrise

	HYRISE_DEFAULT_URL = URI('http://localhost:5000/')

	def loadTable(tablename, tablefile)
		loadOperator = TableLoadOperator.new
		loadOperator.setTableName tablename
		loadOperator.setTableFileName tablefile

		return executeQuery loadOperator.getQuery
	end

	def getTables
		metaOperator = MetaDataOperator.new

		tables = Hash.new
		result = executeQuery metaOperator.getQuery
		
		if !result['rows'].nil?
			result['rows'].each do | row |
				(tables[row.first] ||= []) << row.second
			end
		end

		return tables
	end

	# get the meta data for a specific table. This function assumes that the table is already loaded.
	def getColumnsForTable(table)
		metaOperator = MetaDataOperator.new
		metaOperator.addInput table

		return executeQuery metaOperator.getQuery
	end

	def getContentOfColumns(tablename, columns)
		columns = columns.values.sort_by { |v| v["mode"]}

		projectionOperator = ProjectionScanOperator.new
		projectionOperator.addInput tablename 
		
		groupOperator = GroupByScanOperator.new
		shouldGroup = false

		columns.each do |column|
			if column["mode"] == "select" or column["mode"] == "group"
				projectionOperator.addField column["column"]
			end

			if column["mode"] == "group"
				groupOperator.addField column["column"]
			#	groupOperator.addFunction(1,column["column"])
				shouldGroup = true
			end
		end

		if shouldGroup
			projectionOperator.addEdgeTo(groupOperator)
			query = groupOperator.getQuery
		else
			query = projectionOperator.getQuery
		end
		puts query
		results =  executeQuery query
		#puts results
		output = Hash.new;

		header = results["header"]
		header.each do | column |
			index = header.index(column)
			output[column] = Array.new
			results['rows'].each do | row |
				output[column].push row[index]
			end
		end

		return output
	end

	protected
		def executeQuery(query, url = HYRISE_DEFAULT_URL)
			req = Net::HTTP::Post.new(url.path)
			req.set_form_data({:query=> query, :limit => 0})

			begin

				response = Net::HTTP.new(url.host, url.port).start {|http|
			      http.read_timeout = nil
			      http.request(req)
			    }
				
			rescue Exception => e
				return {"error" => "Server not reachable"}
			end

		    response_body = response.body
		    json = JSON.parse(response_body)

		    jj json
		    json
		end
end