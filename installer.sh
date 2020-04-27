# A simple installer Script that clones the repo and builds your app
echo "Starting installation for deezer client"
mkdir -p ~/.local/bin
mkdir -p ~/.local/share/applications
cd ~/.local/

echo "Removing older installs if any" 
[ -e deezer-client ] && rm -rf deezer-client
[ -e share/deezer-client ] && rm -rf share/deezer-client
[ -e share/applications/deezer-client.desktop ] && rm -f share/applications/deezer-client.desktop
[ -e bin/deezer-client ] && rm -f bin/deezer-client

echo "mkdir deezer-client ..."
mkdir deezer-client

echo "cd deezer-client ..."
cd deezer-client

echo "git clone https://github.com/Billcountry/deezer ..."
git clone https://github.com/Billcountry/deezer

echo "cd deezer ..."
cd deezer

echo "npm install ..."
npm install 

echo "npm run build"
npm run build

echo "mkdir ~/.local/share/deezer-client ..."
mkdir ~/.local/share/deezer-client

echo "mv Deezer-linux-x64/ ~/.local/share/deezer-client ..."
mv -v Deezer-linux-x64/* ~/.local/share/deezer-client/

echo "ln -s ~/.local/share/deezer-client/Deezer ~/.local/bin/deezer-client ..."
ln -s ~/.local/share/deezer-client/Deezer ~/.local/bin/deezer-client

echo "sed 's/~/$HOME/g' deezer-client.desktop > $HOME/.local/share/applications/deezer-client.desktop ..."
sed "s*~*$HOME*g" deezer-client.desktop > $HOME/.local/share/applications/deezer-client.desktop

echo "chmod +x $HOME/.local/share/applications/deezer-client.desktop ..."
chmod +x $HOME/.local/share/applications/deezer-client.desktop

echo "cd ~/.local/ ..."
cd ~/.local/

echo "rm -rf deezer-client ..."
rm -rf deezer-client

echo "Yo! good to go ..."
