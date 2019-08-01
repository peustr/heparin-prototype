# heparin-prototype


## Install the server

To install the server, assuming you have Python3 and virtualenv:

```
cd heparin-prototype/server
virtualenv -ppython3 env
source env/bin/activate
pip install -r requirements.txt
```

To run the server:

```
./run.sh
```

By default it runs at localhost:5000.

## Install the client

To install the client, assuming you have installed NodeJS.

```
cd heparin-prototype/client/hcds
npm install
```

To run the client:

```
npm start
```

By default it runs at localhost:3000.

## Note

- The client and the server must run at the same time.
- The machine learning models at the `server/static` directory are only available by request.
