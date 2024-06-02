DELETE_PART_FILES=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--flag-p) DELETE_PART_FILES=true ;;
        -h|--help) printf "Usage: $0  [-p|--flag-p] \n for deleting only the songs with an unsuccessfull download"; sleep 5; exit 0 ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

cd src/songs

if [ "$DELETE_PART_FILES" = true ]; then
    echo "Deleting songs that were not downloaded successfully..."
    find . -type f -name "*.part" -exec rm -f {} \;
else
    echo "Deleting all songs in the src/songs folder..."
    rm -rf ./*
fi
