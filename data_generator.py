import random

company_ids = range(0,10)
pre_names = ["Steve","Paul","Peter","Larry","Marc","Bill","Hasso"]
last_names = ["Jobs","Attkinson","Page","Gates","Zuckerberg","Plattner"]

file = open('Hyrise/test/tables/employees_salary_10000.tbl','w')

file.write("employee_id|employee_company_id|employee_name|employee_salary\nINTEGER|INTEGER|STRING|INTEGER\n0_C | 0_C | 0_C | 0_C\n===\n")

for i in range(0,10000):
	file.write( str(i) + "|" + str(company_ids[random.randint(0,len(company_ids)-1)]) + "|" + pre_names[random.randint(0,len(pre_names)-1)] + " " + last_names[random.randint(0,len(last_names)-1)] + "|" + str(random.randint(2000,200000)) + "\n")
	
file.close()
