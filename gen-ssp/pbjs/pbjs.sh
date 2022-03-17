#!/bin/bash
EVERY_PROTO_FILES=${1:-$(find $PROTO_PATH -iname "*.proto")}

mkdir -p $OUT_DIR

if ! command -v pbjs &> /dev/null
then
  alias pbjs="yarn pbjs"
  alias pbts="yarn pbts"
fi

pbjs \
  -t static-module \
  -w commonjs \
  -o $OUT_DIR/index.js \
  -p $PROTO_PATH \
  --force-long \
  --force-enum-string \
  --no-delimited \
  --no-verify \
  $EVERY_PROTO_FILES

pbjs \
  -t json \
  -o $OUT_DIR/index.json \
  -p $PROTO_PATH \
  $EVERY_PROTO_FILES

pbjs \
  -t json \
  -o $OUT_DIR/santa-app-browser.json \
  -p $PROTO_PATH \
  $EVERY_PROTO_FILES

pbjs \
  -t json \
  -o $OUT_DIR/santa-app-mobile.json \
  -p $PROTO_PATH \
  $EVERY_PROTO_FILES

pbts \
  -o $OUT_DIR/index.d.ts \
  ${OUT_DIR}/index.js

echo -e "import {Long} from 'protobufjs';\n$(cat $OUT_DIR/index.d.ts)" > $OUT_DIR/index.d.ts
