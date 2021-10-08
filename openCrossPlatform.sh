if which xdg-open &> /dev/null; then
    xdg-open $1       # linux
else
    open $1           # mac
fi
