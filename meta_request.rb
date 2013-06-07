require 'net/http'

HYRISE_META_URL = URI('http://localhost:5000/tables/')

response = Net::HTTP.get_response(HYRISE_META_URL)
puts response.body
