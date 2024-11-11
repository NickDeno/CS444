#!/bin/bash

# Define the directory path
#DIR="F:/Users/Nick DeNobrega/Desktop/CS444-Projects/prj3-sol/localhost-certs"
DIR="C:/Users/Nickd/Desktop/CS444-Projects/prj3-sol/localhost-certs"

# Create the directory and change to it
mkdir -p "$DIR"
cd "$DIR" || exit

# Create a temporary configuration file for OpenSSL
CONFIG_FILE="localhost.conf"
echo -e "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth" > "$CONFIG_FILE"

# Run OpenSSL command with corrected -subj parameter
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "//CN=localhost" -extensions EXT -config "$CONFIG_FILE"

# Clean up the temporary configuration file
rm "$CONFIG_FILE"

#DIR=$HOME/tmp/localhost-certs

#mkdir -p $DIR
#cd $DIR

#<https://letsencrypt.org/docs/certificates-for-localhost/>
#openssl req -x509 -out localhost.crt -keyout localhost.key \
  #-newkey rsa:2048 -nodes -sha256 \
  #-subj '/CN=localhost' -extensions EXT -config <( \
  #printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") 
