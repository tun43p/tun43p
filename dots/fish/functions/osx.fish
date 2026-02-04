function osx -d "Some utils for OSX"
    function help
        set -l lines "Usage: osx <string>" "- help, h: Get the IP address if the current machine" "- dock: Update the Dock settings. You can use 'osx dock kill', 'osx dock show', 'osx dock reset', 'osx dock size <size>'" "- ip: Get the IP address of the current machine" "- hide: Hide a file from Finder" "- unhide: Unhide a file from Finder" "- update: Update Homebrew, upgrade all packages, clean up, upgrade all casks, and update the system"

        for line in $lines
            echo $line
        end
    end

    if test (count $argv) -eq 0
        help
        return 1
    end

    switch $argv[1]
        case help h
            help
        case dock
            switch $argv[2]
                case kill
                    # Hide the Dock
                    defaults write com.apple.dock autohide -bool true && killall Dock
                    defaults write com.apple.dock autohide-delay -float 1000 && killall Dock
                    defaults write com.apple.dock no-bouncing -bool TRUE && killall Dock
                case show
                    # Show the Dock
                    defaults write com.apple.dock autohide -bool false && killall Dock
                    defaults delete com.apple.dock autohide-delay && killall Dock
                    defaults write com.apple.dock no-bouncing -bool FALSE && killall Dock
                case reset
                    # Reset the Dock
                    defaults delete com.apple.dock && killall Dock
                case size
                    # Set the Dock size
                    defaults write com.apple.dock tilesize -int $2; killall Dock
                case '*'
                    echo "Unknown script, use osx help to see the list of available scripts"
                    return 1
            end
        case ip
            # Get the IP address of the current machine
            ipconfig getifaddr en0
        case hide
            # Hide a file from Finder
            chflags hidden $argv[2]
        case unhide
            # Unhide a file from Finder
            chflags nohidden $argv[2]
        case update
            if test -d "$HOME/tmp"
                rm -rf "$HOME/tmp"
            end

            if test -d "$HOME/ai_overlay_tmp"
                rm -rf "$HOME/ai_overlay_tmp"
            end

            # Update Homebrew, upgrade all packages, clean up, upgrade all casks, and update the system
            brew update && brew upgrade && brew cleanup
            brew upgrade --cask $(brew list --cask)
            sudo softwareupdate -i -a
        case '*'
            echo "Unknown script"
            return 1
    end

end
