require 'json'

class Operator < Object
	attr_accessor :id
	def initialize()
		super()
		initializeWithType()
		@ancestors = Array.new
	end

	def addEdgeTo(otherOperator)
		@ancestors.push(otherOperator)
	end

	def edgeArray(depth=0)
		result = Array.new(1) { self }
		for ancestor in @ancestors
			result = result.concat(ancestor.edgeArray(depth+1))
		end
		
		return result
	end

	def to_json(*a)
		{"type"=>@type}.to_json
	end

	private
	def initializeWithType(type="")
		@type = type
	end
end
