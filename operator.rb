require 'json'

class Operator < Object
	attr_accessor :id
	def initialize(id=0,type="")
		super()
		initializeWithType(type)
		@ancestors = Array.new
		self.id=id

	end

	def addEdgeTo(otherOperator)
		@ancestors.push(otherOperator)
	end

	def edgeArray(depth=0)
		result = Array.new
		for ancestor in @ancestors
			result = result.concat(ancestor.edgeArray(depth+1))
		end
		
		return result.concat([self])
	end

	def to_json(*a)
		{"type"=>@type}.to_json
	end

	private
	def initializeWithType(type="")
		@type = type
	end
end
