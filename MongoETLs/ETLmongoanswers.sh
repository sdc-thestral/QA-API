importserver="localhost"
importport="27017"
importdb="questionanswer"
importcollection="answers"
importFile="/Users/ctunakan/SDC/answers.csv"

mongoimport --host $importserver --port $importport --db $importdb --collection $importcollection --type csv --file $importFile --headerline