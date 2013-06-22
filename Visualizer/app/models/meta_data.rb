require 'net/http'

require 'operators/operator.rb'
require 'operators/metadata.rb'
require 'operators/tableload.rb'
require 'operators/projectionscan.rb'
require 'operators/simpletablescan.rb'

class MetaData

	HYRISE_DEFAULT_URL = URI('http://localhost:5000/')

	def loadTable(tablename, tablefile)
		loadOperator = TableLoadOperator.new
		loadOperator.setTableName tablename
		loadOperator.setTableFileName tablefile

		return executeQuery loadOperator.getQuery
	end

	def getTables
		metaOperator = MetaDataOperator.new

		return executeQuery metaOperator.getQuery
	end

	# get the meta data for a specific table. This function assumes that the table is already loaded.
	def getColumnsForTable(table)
		metaOperator = MetaDataOperator.new
		metaOperator.addInput table

		return executeQuery metaOperator.getQuery
	end

	def getContentOfColumns(tablename, tablefile, columns)
		loadOperator = TableLoadOperator.new
		loadOperator.setTableName tablename
		loadOperator.setTableFileName tablefile

		projectionOperator = ProjectionScanOperator.new
		columns.each do |column|
			projectionOperator.addField column
		end

		loadOperator.addEdgeTo(projectionOperator)

		return executeQuery projectionOperator.getQuery
	end

	protected
		def executeQuery(query, url = HYRISE_DEFAULT_URL)
			req = Net::HTTP::Post.new(url.path)
			req.set_form_data({:query=> query, :limit => 0})

			response = Net::HTTP.new(url.host, url.port).start {|http|
		      http.read_timeout = nil
		      http.request(req)
		    }

		    response_body = response.body
		    json = JSON.parse(response_body)

		    jj json
		    json
		end
end