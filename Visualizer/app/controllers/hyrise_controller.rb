class HyriseController < ApplicationController

	def index
		@meta = Hyrise.new
	end
end
