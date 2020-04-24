from flask import Flask,make_response, jsonify,request,json
import datetime
import psycopg2
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from functools import wraps
import ast
import jwt


from hashlib import sha1
from werkzeug.utils import secure_filename

import os

app = Flask(__name__)
app.config['SECRET_KEY']='awdrgyjiokuhtfesq'


if not os.path.exists(os.path.join(app.root_path, 'FilesStore')):
    os.makedirs(os.path.join(app.root_path, 'FilesStore'))

ALLOWED_EXTENSIONS_SHAPE = {'geojson','shp'}
ALLOWED_EXTENSIONS_DATA= {'csv','xml'}
# mysql=MySQL(app)
cors = CORS(app)
bcrypt = Bcrypt(app)


try:
    con = psycopg2.connect(user = "postgres",
                                   password = "Alexa123",
                                   host = "127.0.0.1",
                                   port = "5432",
                                   database = "london_db")
    cursor = con.cursor()
     # Print PostgreSQL Connection properties
    print ( con.get_dsn_parameters(),"\n")

     # Print PostgreSQL version
    cursor.execute("SELECT version();")
    record = cursor.fetchone()
    print("You are connected to - ", record,"\n")

except (Exception, psycopg2.Error) as error :
    print ("Error while connecting to PostgreSQL", error)

#con = pymysql.connect(host="localhost",user="root", password="SravanI19@",db="USERLIST")
# con = psycopg2.connect(user = "sysadmin",
#                                   password = "pynative@#29",
#                                   host = "127.0.0.1",
#                                   port = "5432",
#                                   database = "postgres_db")
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token') #https://127.0.0.1:5000/route?token=adinflv

        if not token:
            return jsonify({'message': 'Token is misssing!'}),403

        try:
            data=jwt.decode(token,app.config['SECRET_KEY'])
        except:
            return jsonify({'message' : 'Token is in invalid!'}),403

        return f(*args,**kwargs)
    return decorated

@app.route('/unprotected')
def unprotected():
    print("anyone")
    return jsonify({'message' : 'Anyone can view this.'})

@app.route('/protected')
@token_required
def protected():
    print("not all")
    return jsonify({'message':'This is only available to the people with valid tokens.'})

@app.route('/users',methods=['GET'])
def get_allusers():
    users=[]
    cursor=con.cursor()
    query = "SELECT USERNAME FROM USERS"
    cursor.execute(query)
    res_users= cursor.fetchall()
    print(res_users)
    for x in res_users:
        temp = []
        temp.append(x[0])
        users.append(temp)
    print(users)
    cursor.close()
    return make_response(jsonify(users), 200)

@app.route('/users/register',methods=["POST","GET"])
def register():
    cursor=con.cursor()

    username=request.json['username']
    password=request.json["password"]
    password= bcrypt.generate_password_hash(password).decode('UTF-8')
    email=request.json["email"]
    usertype=request.json["user_type"]

    query = "INSERT INTO USERS VALUES ('" + str(username) + "', '" + str(email) + "', '" +str(password) + "', '" + str(usertype) + "')"
    cursor.execute(query)
    cursor.close()
    con.commit()
    result={
        "username": username,
        "password" : password,
        "email": email,
        "type" : usertype
    }
    cursor1=con.cursor()
    query = "INSERT INTO Nodedata VALUES ('" + str(username) + "',0,0)"
    cursor1.execute(query)
    cursor1.close()
    con.commit()
    return jsonify({'result' : result})

@app.route('/users/register2',methods=["POST","GET"])
def register2():
    cursor=con.cursor()
    username=request.json['username']
    email=request.json["email"]
    password=bcrypt.generate_password_hash("null").decode('UTF-8')
    user_type=request.json["username"]
    query = f"SELECT * FROM USERS WHERE USERNAME= '{username}'"
    cursor.execute(query)
    result_temp = cursor.fetchall()
    if(result_temp): return jsonify({'result' : "null"})
    else:
        cursor=con.cursor()
        query = "INSERT INTO USERS (username,email,password,user_type) VALUES ('" + str(username) + "', '" + str(email) + "', '" +str(password) + "', '" + str(user_type) + "')"
        cursor.execute(query)
        con.commit()
        result={
        "username": username,
        "password" : password,
        "email": email,
        "type" : user_type
        }
        cursor1=con.cursor()
        query = "INSERT INTO Nodedata VALUES ('" + str(username) + "',0,0)"
        cursor1.execute(query)
        con.commit()
        query = f"INSERT INTO cur_user (username) values ('{username}')"
        cursor.execute(query)
        con.commit()
        return jsonify({'result' : result})

@app.route('/users/login',methods=["POST","GET"])
def login():
    cursor=con.cursor()
    result=[ [ 0 for i in range(4) ] for j in range(1) ]

    username=request.json['username']
    password=request.json["password"]



    query = f"SELECT * FROM USERS WHERE USERNAME= '{username}'"
    cursor.execute(query)
    result_temp = cursor.fetchall()
    # print(result_temp[0][2].strip())
    # print(bcrypt.check_password_hash(result_temp[0][2].strip(),password))
    flag=0
    if (result_temp):
        pwrd=result_temp[0][2].strip()
        if (bcrypt.check_password_hash(str(pwrd),password)):
            flag=1
            result[0][0]=result_temp[0][0]
            result[0][1]=result_temp[0][1]
            result[0][2]=result_temp[0][2]
            result[0][3]=result_temp[0][3]
        else:
            flag=0
        if(flag==1):
            result={
            "username": username,
            "password" : password,
            "email" : result[0][1].strip(),
            "user_type": result[0][3].strip(),
             }
            token=jwt.encode({'user' : username,'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
            print("Token is: ",token.decode('UTF-8'))
            query=f"delete from cur_user"
            cursor.execute(query)
            con.commit()
            query = f"INSERT INTO cur_user (username) values ('{username}')"
            cursor.execute(query)
            con.commit()
            return jsonify({'result' : result,'token':token.decode('UTF-8')})
        else: return jsonify({'result' : "passnotmatch"})
    else:
        return jsonify({'result' : "false"})


@app.route('/users/usernamevalidation',methods=["POST","GET"])
def validation():
    cursor=con.cursor()
    username=request.json['username']
    query = f"SELECT * FROM USERS WHERE USERNAME= '{username}'"
    cursor.execute(query)
    result_temp = cursor.fetchall()
    cursor.close()
    if(result_temp): return jsonify({'result' : "true"})
    else : return jsonify({'result' : "false"})

@app.route('/users/register3',methods=["POST","GET"])
def register3():
    cursor=con.cursor()
    user_type=request.json["user_type"]
    username=request.json["username"]
    query = f"UPDATE USERS SET USER_TYPE='{user_type}' WHERE USERNAME= '{username}'"
    cursor.execute(query)
    cursor.close()
    con.commit()
    result={
        "username": username,
        "type" : user_type
        }
    return jsonify({'result' : result})

@app.route('/users/logincheck',methods=["POST","GET"])
def logincheck():
    cursor=con.cursor()
    result=[ [ 0 for i in range(4) ] for j in range(1) ]
    username=request.json['username']
    query = f"SELECT * FROM USERS WHERE USERNAME= '{username}'"
    cursor.execute(query)
    result_temp = cursor.fetchall()
    cursor.close()
    con.commit()
    if (result_temp):
        for i in range(0,len(result_temp)):
            result[0][0]=result_temp[i][0]
            result[0][1]=result_temp[i][1]
            result[0][2]=result_temp[i][2]
            result[0][3]=result_temp[i][3]
        result={
            "username": result[0][0],
            "password" : result[0][2],
            "email" : result[0][1],
            "user_type": result[0][3].strip(),
        }
        return jsonify({'result' : result})
    else:
        return jsonify({'result' : "notfound"})


@app.route('/shortestpath',methods=["POST","GET"])
def shortestpath():

    print("innn")

    x1=request.json['x1']
    print(round(x1,8))
    y1=request.json['y1']
    print(round(y1,8))

    print()

    x2=request.json['x2']
    print(round(x2,8))
    y2=request.json['y2']
    print(round(y2,8))

    print()

    cursor=con.cursor()

    # Start Node
    query_start = f"SELECT id FROM public.ways_vertices_pgr WHERE lon='{round(x1,8)}' and lat='{round(y1,8)}'"
    cursor.execute(query_start)
    result = cursor.fetchall()
    startNode = result[0][0]
    print(startNode)

    # End Node
    query_end = f"SELECT id FROM public.ways_vertices_pgr WHERE lon='{round(x2,8)}' and lat='{round(y2,8)}'"
    cursor.execute(query_end)
    result = cursor.fetchall()
    endNode = result[0][0]
    print(endNode)

    print()

    # pgrouting query for shortest path by length
    query_SP_length = f"CREATE TABLE route_result_length AS\
                    SELECT ways.*, route.cost AS route_cost FROM ways JOIN (\
                    SELECT * FROM pgr_dijkstra(\
                        'SELECT gid as id,\
                                source,\
                                target,\
                                length as cost FROM ways',\
                                {startNode}, {endNode}, false))\
                            AS route ON ways.gid = route.edge;\
                    SELECT ST_AsGeoJSON(ST_UNION(ST_Transform(the_geom, 3857))) AS geom_union\
                    FROM route_result_length;"
    cursor.execute(query_SP_length)
    result = cursor.fetchall()
    shortestPathNodes = result
    print(shortestPathNodes[0][0])
    print(len(shortestPathNodes))
    print()

    result1 = json.loads(shortestPathNodes[0][0])

    # # pgrouting query for shortest path by cfp
    query_SP_lengthcfp = f"CREATE TABLE route_result_lengthcfp AS\
                    SELECT ways.*, route.cost AS route_cost FROM ways JOIN (\
                    SELECT * FROM pgr_dijkstra(\
                        'Select ways.gid as id,\
                                ways.source,\
                                ways.target,\
                                c.length_cfp as cost from ways_cfp as c join ways on ways.gid=c.gid',\
                                {startNode}, {endNode}, false))\
                            AS route ON ways.gid = route.edge;\
                    SELECT ST_AsGeoJSON(ST_UNION(ST_Transform(the_geom, 3857))) AS geom_union\
                    FROM route_result_lengthcfp;"
    cursor.execute(query_SP_lengthcfp)
    result = cursor.fetchall()
    shortestPathNodescfp = result
    print(shortestPathNodescfp[0][0])
    print(len(shortestPathNodescfp))
    print()

    result2 = json.loads(shortestPathNodescfp[0][0])

    query_Drop_SP = f"DROP TABLE route_result_length;"
    cursor.execute(query_Drop_SP)

    query_Drop_SP_cfp = f"DROP TABLE route_result_lengthcfp;"
    cursor.execute(query_Drop_SP_cfp)

    # global gadad
    # username = gadbad
    query=f"select * from cur_user"
    cursor.execute(query)
    res=cursor.fetchall()
    print(res[0][0])
    username=res[0][0]
    query = f"UPDATE NodeData SET Source={startNode}, Destination={endNode} WHERE  Username = '{username}'"
    cursor.execute(query)
    con.commit()

    result={
        "sp_length": result1,
        "sp_cfp" : result2,
    }
    return jsonify(result)

@app.route('/gettwoshortestpaths',methods=["POST","GET"]) #getPossiblePath
def gettwoshortestpaths():
    print("inn")
    print(request.data)
    username=request.json['username']
    no_of_vehicles=request.json["no_of_vehicles"]
    source_location =request.json["source_location"]
    destination_location =request.json["destination_location"]
    print(username,no_of_vehicles,source_location,destination_location)

    # path 1 with shortest length
    print("path1 querying")
    query_sp_length = f"select node from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, ways.length as cost from ways', {source_location}, {destination_location}, false);"
    cursor.execute(query_sp_length)
    result = cursor.fetchall()
    path1 = result
    print("path1")
    print(path1)

    # path 2 with least cfp
    print("path2 querying")
    query_sp_cfp = f"select node from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, c.length_cfp as cost from ways_cfp as c join ways on ways.gid=c.gid', {source_location}, {destination_location}, false);"
    cursor.execute(query_sp_cfp)
    result = cursor.fetchall()
    path2 = result
    print("path2")
    print(path2)

    query_cfp_length = f"select sum(b.cost*c.total_cfp) from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, ways.length as cost from ways', {source_location}, {destination_location}, false) as b join nodesarea_join_areascfp as c on b.node = c.id;"
    cursor.execute(query_cfp_length)
    result = cursor.fetchall()
    print("==========result")
    cfp1 = float(result[0][0])*float(no_of_vehicles)
    print("cfp1")
    print(result, cfp1)

    query_cfp_lengthcfp = f"select sum(cost) from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, c.length_cfp as cost from ways_cfp as c join ways on ways.gid=c.gid', {source_location}, {destination_location}, false);"
    cursor.execute(query_cfp_lengthcfp)
    result = cursor.fetchall()
    print("==========result")
    cfp2 = float(result[0][0])*float(no_of_vehicles)
    print("cfp2")
    print(result, cfp2)



    # pusing the node to NodeData

    query = f"UPDATE NodeData SET Source={source_location}, Destination={destination_location} WHERE  Username = '{username}'"
    cursor1=con.cursor()
    cursor1.execute(query)
    con.commit()

    result={
        "dhjs" : "fgyweuhs",
        "paths": [path1, path2],
        "cfp1" : cfp1 ,
        "cfp2" : cfp2
          # "paths": [[1,2],[3,4]],
          # "cfp1" : 10,
          # "cfp2" : 10
    }
    return jsonify({'result' : result})

@app.route('/bestshortestpath',methods=["POST","GET"]) # path for shortest length
def bestshortestpath():
    print("1st")
    print(request.data)
    username=request.json['username']
    no_of_vehicles=request.json["no_of_vehicles"]
    source_location =request.json["source_location"]
    destination_location =request.json["destination_location"]
    Date  = datetime.datetime.utcnow()
    print(username,no_of_vehicles,source_location,destination_location)

    query_cfp_length = f"select sum(b.cost*c.total_cfp) from (select seq, node, edge, cost from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, ways.length as cost from ways', {source_location}, {destination_location}, false)) as b join nodesarea_join_areascfp as c on b.node = c.id;"
    cursor.execute(query_cfp_length)
    result = cursor.fetchall()
    cfp1 = float(result[0][0])*float(no_of_vehicles)
    print(result, cfp1)

    # cfp1 = 12
    credit = 12

    # query to the Upload the data according to the schema
    cursor1=con.cursor()
    query = f"INSERT INTO ManagerData (Username,Day,nooftrucks,Source,Destination,carbonfootprint,creditsspent) VALUES ('{username}', '{Date}',{no_of_vehicles},{source_location},{destination_location},{cfp1},{credit})"
    cursor1.execute(query)
    con.commit()

    return jsonify({'result' : 'Data uploaded into the users data'})

@app.route('/secondbestshortestpaths',methods=["POST","GET"])  # path with least cfp
def secondbestshortestpaths():
    print("2nd")
    print(request.data)
    username=request.json['username']
    no_of_vehicles=request.json["no_of_vehicles"]
    source_location =request.json["source_location"]
    destination_location =request.json["destination_location"]
    Date  = datetime.datetime.utcnow()
    print(username,no_of_vehicles,source_location,destination_location)

    query_cfp_lengthcfp = f"select sum(cost) from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, c.length_cfp as cost from ways_cfp as c join ways on ways.gid=c.gid', {source_location}, {destination_location}, false);"
    cursor.execute(query_cfp_lengthcfp)
    result = cursor.fetchall()
    cfp2 = float(result[0][0])*float(no_of_vehicles)
    print(result, cfp2)

    # cfp1 = 12
    credit = 12

    # query to the Upload the data according to the schema
    cursor1=con.cursor()
    query = f"INSERT INTO ManagerData (Username,Day,nooftrucks,Source,Destination,carbonfootprint,creditsspent) VALUES ('{username}', '{Date}',{no_of_vehicles},{source_location},{destination_location},{cfp2},{credit})"
    cursor1.execute(query)
    con.commit()

    return jsonify({'result' : 'Data uploaded into the users data'})

@app.route('/PreemptiveCalculation',methods=["POST","GET"])
def PreemptiveCalculation():
    print("===============================PREEMPTIVE================================")
    print(request.data)
    no_of_vehicles=request.json["no_of_vehicles"]
    source_location =request.json["source_location"]
    destination_location =request.json["destination_location"]
    print(no_of_vehicles,source_location,destination_location)

    query_cfp_length = f"select sum(b.cost*c.total_cfp) from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, ways.length as cost from ways', {source_location}, {destination_location}, false) as b join nodesarea_join_areascfp as c on b.node = c.id;"
    cursor.execute(query_cfp_length)
    result = cursor.fetchall()
    print("==========result")
    cfp1 = float(result[0][0])*float(no_of_vehicles)
    print("cfp1")
    print(result, cfp1)

    query_cfp_lengthcfp = f"select sum(cost) from pgr_dijkstra('Select ways.gid as id, ways.source, ways.target, c.length_cfp as cost from ways_cfp as c join ways on ways.gid=c.gid', {source_location}, {destination_location}, false);"
    cursor.execute(query_cfp_lengthcfp)
    result = cursor.fetchall()
    print("==========result")
    cfp2 = float(result[0][0])*float(no_of_vehicles)
    print("cfp2")
    print(result, cfp2)

    result={
        "cfp1" : cfp1 ,
        "cfp2" : cfp2
        # "cfp1" : 12 ,
        # "cfp2" : 10
    }
    return jsonify({'result' : result})

@app.route('/executiveupload',methods=["POST","GET"])
def executiveupload():
    username = request.form['username']
    file = request.files['file']
    # Check if the file name is empty if yes, send a return statement
    if file.filename == '':
        # No Such File
        d = {
            "error": "Empty file name not allowed"
        }
        return make_response(jsonify(d), 415)
    # Accept only certain file formats
    if file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS_SHAPE :
        d = {
            "error": "Format not allowed"
        }
        return make_response(jsonify(d), 415)

    filename = secure_filename(file.filename)
    # TODO : If the filename already exsists , Then send a response back saying the file name already exsists
    #uploading to the file server.
    cursor2=con.cursor()
    query = f"SELECT * FROM ExecutiveData WHERE file_name= '{filename}'"
    cursor2.execute(query)
    result_temp = cursor2.fetchall()
    cursor2.close()
    con.commit()
    if (result_temp):
        d = {
            "error": "File with the same name exists ."
        }
        return make_response(jsonify(d), 415)

    # Generate unique file id
    string_to_hash = username + filename
    f_id = sha1(string_to_hash.encode()).hexdigest()

    # uploading the data into executive officer database
    f_type = file.filename.rsplit('.', 1)[1].lower()
    print(f_type)
    cursor1=con.cursor()
    query = f"INSERT INTO ExecutiveData (Username,file_id,file_type,file_name) VALUES('{username}','{f_id}','{f_type}','{filename}')"
    cursor1.execute(query)
    con.commit()
    try:
        file = request.files['file']
        file.save(os.path.join(app.root_path, 'FilesStore', f_id))
        d = {
            "success": True
        }
        return make_response(jsonify(d), 200)
    except Exception as e:
        print(e)
        d = {
            "error": f"{e}"
        }
        return make_response(jsonify(d), 415)

@app.route('/executiveuploaddata',methods=["POST","GET"])
def executiveuploaddata():
    username = request.form['username']
    file = request.files['file']
    # Check if the file name is empty if yes, send a return statement
    if file.filename == '':
        # No Such File
        d = {
            "error": "Empty file name not allowed"
        }
        return make_response(jsonify(d), 415)
    # Accept only certain file formats
    if file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS_DATA :
        d = {
            "error": "Format not allowed"
        }
        return make_response(jsonify(d), 415)
    filename = secure_filename(file.filename)
    # Generate unique file id
    string_to_hash = username + filename
    f_id = sha1(string_to_hash.encode()).hexdigest()

    # TODO : If the filename already exsists , Then send a response back saying the file name already exsists
    #uploading to the file server
    filename = secure_filename(file.filename)
    cursor2=con.cursor()
    query = f"SELECT * FROM ExecutiveData WHERE file_name= '{filename}'"
    cursor2.execute(query)
    result_temp = cursor2.fetchall()
    cursor2.close()
    con.commit()
    if (result_temp):
        d = {
            "error": "File with the same name exists ."
        }
        return make_response(jsonify(d), 415)

    # uploading the data into executive officer database
    f_type = file.filename.rsplit('.', 1)[1].lower()
    print(f_type)
    cursor1=con.cursor()
    query = f"INSERT INTO ExecutiveData (Username,file_id,file_type,file_name) VALUES('{username}','{f_id}','{f_type}','{filename}')"
    cursor1.execute(query)
    con.commit()
    try:
        file = request.files['file']
        file.save(os.path.join(app.root_path, 'FilesStore', f_id))
        d = {
            "success": True
        }
        return make_response(jsonify(d), 200)
    except Exception as e:
        print(e)
        d = {
            "error": f"{e}"
        }
        return make_response(jsonify(d), 415)

@app.route('/getsourcedestination',methods=["POST","GET"])
def getsourcedestination():
    print(request.data)
    username=request.json['username']
    print(username, "username==============")
    # username = "Shreeya"
    query = f"SELECT Source, Destination FROM NodeData WHERE Username = '{username}'"
    cursor.execute(query)
    res=cursor.fetchall()
    result={
        "source" : res[0][0],
        "destination" : res[0][1]
    }
    print(result, "result==============")
    return jsonify({'result': result})

@app.route('/getsourcedestinationmanual',methods=["POST","GET"])
def getsourcedestinationmanual():
    print(request.data)
    query=f"select * from cur_user"
    cursor.execute(query)
    res=cursor.fetchall()
    print(res[0][0])
    username=res[0][0]
    # print(username, "username==============")
    # username = "Shreeya"
    query = f"SELECT Source, Destination FROM NodeData WHERE Username = '{username}'"
    cursor.execute(query)
    res=cursor.fetchall()

    source = res[0][0]
    destination = res[0][1]

    query = f"select lon,lat from ways_vertices_pgr where id = {source};"
    cursor.execute(query)
    res=cursor.fetchall()
    startCoord = res
    print(startCoord, "start==============")

    query = f"select lon,lat from ways_vertices_pgr where id = {destination};"
    cursor.execute(query)
    res=cursor.fetchall()
    destCoord = res
    print(destCoord, "dest==============")

    result={
        "source" : startCoord,
        "destination" : destCoord
    }
    print(result, "result==============")
    return jsonify({'result': result})

@app.route('/companyanalysis',methods=["POST","GET"])
def companyanalysis():
    print(request.data)
    username=request.json['username']
    # username = "ven"
    query = f"SELECT Day,nooftrucks,Source,Destination,carbonfootprint,creditsspent FROM ManagerData WHERE Username = '{username}'"
    cursor1=con.cursor()
    cursor1.execute(query)
    res=cursor1.fetchall()
    print(res)
    result={
        "d" : res
    }
    return jsonify({'result': result})

@app.route('/cfp',methods=["POST","GET"])
def cfp():
    username=request.json['username']
    # username = "ven"
    query = f"SELECT sum(carbonfootprint) FROM ManagerData WHERE Username = '{username}'"
    cursor1=con.cursor()
    cursor1.execute(query)
    res=cursor1.fetchall()
    print(res)
    result={
        "d" : res
    }
    return jsonify({'result': result})

@app.route('/sourcenodecheck',methods=["POST","GET"])
def sourcenodecheck():
    source_location=request.json['source_location']
    print(source_location, "=========Source")

    query = f"SELECT * FROM ways_vertices_pgr WHERE id = {source_location};"
    cursor1=con.cursor()
    cursor1.execute(query)
    res=cursor1.fetchall()
    print(res, "============Source entry")

    if(res == []):
        result="null"
    else:
        result=res
    print(result, "========result Source")

    return jsonify({'result': result})

@app.route('/destinationnodecheck',methods=["POST","GET"])
def destinationnodecheck():
    destination_location=request.json['destination_location']
    print(destination_location, "=========Dest")

    query = f"SELECT * FROM ways_vertices_pgr WHERE id = {destination_location};"
    cursor1=con.cursor()
    cursor1.execute(query)
    res=cursor1.fetchall()
    print(res, "============Dest entry")

    if(res == []):
        result="null"
    else:
        result=res
    print(result, "========result Dest")

    return jsonify({'result': result})


if __name__ == "__main__":
    app.run(debug=True)
