function gc -d "Google Cloud"
    if test (count $argv) -eq 0
        return 1
    end

    switch $argv[1]
      case login l
        gcloud auth login
        gcloud auth application-default login
      case project p
        if test (count $argv) -eq 0
            gcloud projects list
            return 0
        end
        gcloud config set project $argv[2]
      case '*'
        echo "Unknown command"
        return 1
    end
end
