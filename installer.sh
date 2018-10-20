# A simple installer Script that clones the repo and builds your app
ech "cd /tmp ..."
cd /tmp

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

echo "mv -r Deezer-linux-x64/* ~/.local/share/deezer-client ..."
mv -r Deezer-linux-x64/* ~/.local/share/deezer-client

echo "ln -s ~/.local/share/deezer-client/Deezer ~/.local/bin/deezer-client ..."
echo ln -s ~/.local/share/deezer-client/Deezer ~/.local/bin/deezer-client

echo "cp deezer-client.desktop ~/.local/share/applications ..."
cp deezer-client.desktop ~/.local/share/applications

echo "cd /tmp ..."
cd /tmp

echo "rm -r deezer-client ..."
rm -r deezer-client

echo "Yo! good to go ..."