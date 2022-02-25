ENTRY_PATH=.pollapo
OUT_DIR=src/generated/ssp
EXT_IN_IMPORT=" "
INDEX_FILENAME=index

if ! command -v pb &> /dev/null
then
  pbgents="yarn pb-gen-ts"
  pbgents="yarn pb-gen-ts"
else
  pbgents="pb gen ts"
  pbgents="pb gen ts"
fi

$pbgents \
--entry-path $ENTRY_PATH \
-o $OUT_DIR \
--ext-in-import "$EXT_IN_IMPORT" \
--index-filename $INDEX_FILENAME \
