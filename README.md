# node-app

### Notes

### Clean up
```
oc delete deploy node-app
oc delete svc node-app
oc delete bc node-app
oc delete is node-app
oc delete route node-app
oc delete secret mytls
rm -f certs/rootCA.*
rm -f certs/tls.*
```


1. passthrough 
```
oc new-app nodejs:14-ubi8~https://github.com/dyangcht/node-app.git
oc delete svc node-app
oc expose deployment node-app --port=5000
cd certs
./gen-key node-app-streams.apps.cluster-44d9.sandbox1656.opentlc.com node-app
```
2. reencrypt
```
cd certs
openssl genrsa -out rootCA.key 4096
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.crt -subj "/CN=apps.cluster-44d9.sandbox1656.opentlc.com"
openssl req -sha256 -newkey rsa:4096 -nodes -keyout tls.key -subj "/C=TW/ST=TP/O=RH, Inc./CN=node-app-streams.apps.cluster-44d9.sandbox1656.opentlc.com" -out tls.csr
openssl x509 -req -in tls.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out tls.crt -days 500 -sha256
git commit -am "updates"
git push
oc new-app nodejs:14-ubi8~https://github.com/dyangcht/node-app.git
oc delete svc node-app
oc expose deployment node-app --port=5000
oc create route reencrypt --service=node-app --dest-ca-cert=rootCA.crt --hostname=node-app-streams.apps.cluster-44d9.sandbox1656.opentlc.com

oc create secret tls mytls --cert=tls.crt --key=tls.key
oc set volume deployment/node-app --add --name=v1 --type=secret --secret-name='mytls' --mount-path=/opt/app-root/src/certs
```
