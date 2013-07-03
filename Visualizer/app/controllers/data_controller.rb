class DataController < ApplicationController
	before_filter :load_data_model

	def index
		@scheme = @data.getTables
	end

	def load_table
		@data.loadTable(params[:table], params[:file]) unless params[:table].blank? || params[:file].blank?
		redirect_to root_url
	end

	def get_columns
		results = @data.getContentOfColumns(params[:tablename], params[:columns]) unless params[:tablename].blank? || params[:columns].blank?

		render json: results
	end

	protected

		def load_data_model
			@data = Hyrise.new
		end
end
