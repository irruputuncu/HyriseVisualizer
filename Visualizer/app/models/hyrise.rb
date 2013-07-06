require 'net/http'

require 'operators/operator.rb'
require 'operators/metadata.rb'
require 'operators/tableload.rb'
require 'operators/projectionscan.rb'
require 'operators/simpletablescan.rb'
require 'operators/groupbyscan.rb'
require 'operators/hashbuild.rb'
require 'operators/sortscan.rb'

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

		
		unless result['rows'].nil?
			result['rows'].each do | row |
				table = { name: row.second, type: row.third}

				#get the smalles and the highest value for each column if type is 0 or 1
				if row.third == 0 || row.third == 1
					projectionOperator = ProjectionScanOperator.new

					projectionOperator.addInput row.first
					projectionOperator.addField row.second
					data = executeQuery projectionOperator.getQuery

					unless data['rows'].nil?
						table[:min] = data['rows'].first.first
						table[:max] = data['rows'].last.first
					end
				end

				(tables[row.first] ||= []) << table
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

	def getContentForSeries(series, xaxis)

		content = Array.new
		series.each do | index, serie |
			finalResult = Hash.new
			column = serie['yColumn']
			tablename = column["table"]
			projectionOperator = ProjectionScanOperator.new

			projectionOperator.addInput tablename 
			projectionOperator.addField xaxis["column"] # so this column will be the first in result
			projectionOperator.addField column["column"]

			if column["aggregation"] != 'none'
				groupOperator = GroupByScanOperator.new
				hashBuildOperator = HashBuildOperator.new

				hashBuildOperator.addField xaxis["column"]

				groupOperator.addField xaxis["column"]

				case column["aggregation"]
					when 'count'
						groupOperator.addFunction(1, xaxis["column"])
					when 'average'
						groupOperator.addFunction(2, xaxis["column"])
					when 'sum'
						groupOperator.addFunction(0, xaxis["column"])
					else
						groupOperator.addFunction(1, xaxis["column"])
				end

				projectionOperator.addEdgeTo(hashBuildOperator)
				projectionOperator.addEdgeTo(groupOperator)
				hashBuildOperator.addEdgeTo(groupOperator)

				result = executeQuery groupOperator.getQuery
			else
				result = executeQuery projectionOperator.getQuery
			end

			unless result['rows'].nil?
				if xaxis['type'].to_i < 2
					result['rows'].each do | row |
						(finalResult['data'] ||= []) << [row.first, row.second]
					end
				else
					categories = []
					result['rows'].each do | row |
						categories << row.first
						(finalResult['data'] ||= []) << row.second
					end
					finalResult['categories'] = categories.uniq
				end
				finalResult['axis'] = serie['axis']
				finalResult['id'] = column['id']
				finalResult['name'] = result['header'].second
				finalResult['name'][xaxis['column']] = column['column'] if finalResult['name'].include? xaxis["column"]  #replace names like COUNT(xaxis) with COUNT(yaxis)
			end

			content.push finalResult 
		end

		return content
	end

	def getContentOfColumns(columns)
		columns = columns.values.sort_by { |v| v["mode"]}
		tablename = columns.first["table"]

		projectionOperator = ProjectionScanOperator.new
		projectionOperator.addInput tablename 
		
		groupOperator = GroupByScanOperator.new
		hashBuildOperator = HashBuildOperator.new
		shouldGroup = false

		columns.each do |column|
			if column["mode"] == "select" or column["mode"] == "group"
				projectionOperator.addField column["column"]
			end

			if column["mode"] == "group"
				groupOperator.addField column["column"]
				groupOperator.addFunction(1, column["column"])
				hashBuildOperator.addField column["column"]
				shouldGroup = true
			end
		end

		if shouldGroup
			projectionOperator.addEdgeTo(hashBuildOperator)
			projectionOperator.addEdgeTo(groupOperator)
			hashBuildOperator.addEdgeTo(groupOperator)
			query = groupOperator.getQuery
		else
			query = projectionOperator.getQuery
		end
		puts query
		
		results = executeQuery query
		#puts results
		
		output = Hash.new;

		output['rows'] = results['rows']
		header = results["header"]

		unless header.nil?
			header.each do | column |
				index = header.index(column)
				output[column] = Array.new
				results['rows'].each do | row |
					output[column].push row[index]
				end
			end
		end
		
		#puts output['rows']
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