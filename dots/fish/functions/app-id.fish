function app-id -d "Get the app id of a given app name"
    if test -z "$argv[1]"
        echo "Usage: app-id <app-name>"
        return 1
    end

    set app_name "$argv[1]"

    osascript -e 'id of app "'$app_name'"'
end