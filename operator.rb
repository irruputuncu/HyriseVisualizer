require 'json'

class Operator < Object
	attr_accessor :id, :ancestors

	def initialize()
		super()
		initializeWithType()
		@ancestors = Array.new
	end

	def addEdgeTo(otherOperator)
		otherOperator.ancestors << self
	end

	def edgeArray(depth=0)
		result = Array.new(1) { self }
		for ancestor in @ancestors
			result = ancestor.edgeArray(depth+1).concat(result)
		end
		
		return result
	end

	def edges()
		result = Array.new()
		for ancestor in @ancestors
			result.push([ancestor.id.to_s(), self.id.to_s()])
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
