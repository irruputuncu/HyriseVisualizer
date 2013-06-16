class MetaDataController < ApplicationController

	def index
		@meta = MetaData.new
	end
end
