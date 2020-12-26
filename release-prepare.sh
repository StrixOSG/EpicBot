#!/bin/sh
git checkout main
git pull origin main

if [ $# -eq 0 ]
    then
        standard-version
else
    if [ "$1" = "--dry-run" ]
        then
            standard-version $1
            exit 0
    elif [ "$1" = "--release-as" ]
        then
            if [ "$2" = "minor" ] || [ "$2" = "major" ] || [ "$2" = "patch" ]
                then
                    standard-version $1 $2
            else
                echo "Error: Incorrect second argument, use either 'minor', 'major', or 'patch'"
                exit 1
            fi

    else
        echo "Error: Incorrect first argument, use '--dry-run' or '--release-as'"
        exit 1
    fi
fi

git push --follow-tags origin master