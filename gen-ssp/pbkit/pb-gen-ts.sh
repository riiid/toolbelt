ENTRY_PATH=.pollapo
OUT_DIR=src/generated/ssp
EXT_IN_IMPORT=' '
INDEX_FILENAME=index

if ! command -v pb-gen-ts &> /dev/null
then
  alias pb-gen-ts="yarn pb-gen-ts"
  alias pb-gen-ts="yarn pb-gen-ts"
else
  alias pb-gen-ts="pb gen ts"
  alias pb-gen-ts="pb gen ts"
fi

pb-gen-ts \
--entry-path $ENTRY_PATH \
-o $OUT_DIR \
--ext-in-import $EXT_IN_IMPORT \
--index-filename $INDEX_FILENAME \
