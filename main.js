const electron = require("electron")
const platform = require("os").platform()

const {
    app,
    BrowserWindow,
    globalShortcut,
    Tray,
    Menu,
    ipcMain,
    Notification,
    nativeImage,
} = electron

let win
let tray
let complete_exit = false
let notification
const init_js = `
if(!window.client_setadresdcsac){
    const electron = require("electron");
    window.ipc = electron.ipcRenderer;
    window.dzPlayer.trigger = function(action){
        return function(name, job){
            ipc.send("notifs", name)
            return action.call(window.dzPlayer, name, job)
        }
    }(window.dzPlayer.trigger);
    window.client_setadresdcsac = true
}
`

function initApp(params) {
    // Create window
    win = new BrowserWindow({ icon: __dirname + "/Icon.png" })
    win.loadURL("https://www.deezer.com/en/")
    win.maximize()

    win.on("close", event => {
        if (!complete_exit) {
            event.preventDefault()
            isPlaying(show_hide, exit)
        } else {
            app.quit()
        }
    })

    // Register Shortcuts
    globalShortcut.register("MediaPlayPause", () => {
        isPlaying(pause, play)
    })
    globalShortcut.register("MediaNextTrack", next)
    globalShortcut.register("MediaPreviousTrack", prev)

    // Handle Events from client
    ipcMain.on("notifs", handleClientNotifs)
    win.webContents.on("did-stop-loading", event => {
        win.webContents.executeJavaScript(init_js)
    })

    // Tray Menu control
    setUpTray()
}
function setUpTray() {
    const image = nativeImage.createFromPath(__dirname + "/icons/Icon.png")
    image.setTemplateImage(true)
    tray = new Tray(image)

    const menu = Menu.buildFromTemplate([
        { label: "Show/Hide", type: "normal", click: show_hide },
        { label: "Next Track", type: "normal", click: next },
        { label: "Previous Track", type: "normal", click: prev },
    ])
    tray.setContextMenu(menu)
    tray.on("click", show_hide)
    tray.setTitle("Deezer")
    tray.setToolTip("Deezer")
    tray.on("click", () => {
        console.log("Push out something")
    })
}

function handleClientNotifs(event, notif) {
    switch (notif) {
        case "audioPlayer_playTracks":
        case "audioPlayer_play":
        case "audioPlayer_pause":
            osNotify(notif)
            break
    }
}

function osNotify(notif) {
    win.webContents.executeJavaScript(
        `[
            dzPlayer.getSongTitle(),
            dzPlayer.getAlbumTitle(),
            dzPlayer.getArtistName(),
            dzPlayer.isPlaying()
        ]`,
        result => {
            let [title, alburm, artist, playing] = result
            playing = notif === "audioPlayer_playTracks" ? true : playing
            if (Notification.isSupported()) {
                if (!notification) {
                    notification = new Notification({
                        title: `${title} - ${artist}`,
                        body: `${
                            playing ? "Playing" : "Paused"
                        }, Alburm: ${alburm}`,
                        icon: __dirname + "/Icon.png",
                        silent: true,
                    })
                } else {
                    notification.title = `${title} - ${artist}`
                    notification.body = `${
                        playing ? "Playing" : "Paused"
                    }, Alburm: ${alburm}`
                }
                notification.show()
                notification.on("click", () => {
                    notification.close()
                    win.show()
                })
            }
        }
    )
}

function show_hide() {
    win.isVisible() ? win.hide() : win.show()
}

function exit() {
    complete_exit = true
    win.close()
}

function play() {
    win.webContents.executeJavaScript("dzPlayer.control.play()")
}

function pause() {
    win.webContents.executeJavaScript("dzPlayer.control.pause()")
}

function next() {
    win.webContents.executeJavaScript("dzPlayer.control.nextSong()")
}

function prev() {
    win.webContents.executeJavaScript("dzPlayer.control.prevSong()")
}

function isPlaying(playing, paused) {
    win.webContents.executeJavaScript("dzPlayer.isPlaying()", isPlaying => {
        isPlaying ? playing() : paused()
    })
}

app.on("ready", initApp)

app.on("will-quit", () => {
    globalShortcut.unregisterAll()
})
