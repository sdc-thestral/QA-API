importserver="localhost"
importport="27017"
importdb="questionanswer"
importcollection="questions"
importFile="/Users/ctunakan/SDC/questions.csv"

mongoimport --host $importserver --port $importport --db $importdb --collection $importcollection --type csv --file $importFile --headerline