# HarmonySpan
a Node.JS application that allows you to trigger webhooks directly from a Logitech Harmony Hub and compatible remote.

Have you found HarmonySpan useful? Go ahead and buy me a coffee;

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/A0A61WGUQ)

Thanks for your support!

## Quick Setup
Have your Harmony Remote, a MicroUSB cable, and the MyHarmony desktop software ready, as well as a plaintext editor of your choice (notepad works fine here).

Download the latest binaries for your platform (HarmonySpan currently has pre-built binaries for Windows, macOS, and Linux available at https://github.com/AShifter/harmony-span/releases/).

Run the executable you downloaded - if you get any popups asking for firewall permission in Windows, check both Private and Public networks permission. HarmonySpan will automatically find your first suitable network adapter.

![Windows Defender Firewall Notification](https://i.imgur.com/Ty6YcHM.png)

On Linux/macOS machines you might have to run `chmod +x` on the binary itself to enable the executable flag for that file.

Connect your Harmony Remote (or Hub if you don't have a remote with a MicroUSB port, like a Companion remote) to your PC running the MyHarmony Software and scan for SSDP devices;

![MyHarmony Desktop Software, Scan for devices](https://i.imgur.com/GCnIPTr.png)

a Roku device with the serial number HARMONY-FREEDOM should appear - this is your HarmonySpan server. Add it to your remote and **make sure you sync over USB.** After this step, you can sync wirelessly. You only need to sync over USB when you're initally adding HarmonySpan.

![MyHarmony Desktop Software, Harmony Span appearing](https://i.imgur.com/xSCdwNI.png)

Unplug your remote and go to the Devices menu. HarmonySpan should appear - enter the HarmonySpan device and try pressing some buttons. You should see feedback in the terminal showing what buttons you're pressing.

![Terminal Feedback from HarmonySpan](https://i.imgur.com/zPqd60M.png)

Stop HarmonySpan (``CTRL+C``) and open the ``config.json`` file again. There's a webhook definition for each virtual 'button' that HarmonySpan is watching - these relate to the buttons you see being pressed in your terminal.

For simple IFTTT webhooks, just paste the webhook URL in the URL field for each button you want to attach to a webhook (don't make changes to the ``header`` or ``query`` values), save, and start HarmonySpan again. Every time HarmonySpan sees the button that you attached a webhook to getting pressed, it will trigger that webhook.

You can also add a body and header to the request if you want to talk directly to the API for things like LIFX bulbs. The ``query`` string is sent as the request body, and ``header`` as the request header.

At this point you can do whatever you want with the buttons - adding those buttons to a sequence in another activity is a great way to get started integrating more smart home functionality into your remote.

## How It Works
Logitech allows you to control 'IP devices' over your local network (think Roku, NVIDIA SHIELD, Apple TV) rather than controlling them with IR. This works because each device broadcasts to a local Simple Service Discovery Protocol (SSDP) IP (``239.255.255.250``, chances are you can see traffic on it in your network with Wireshark) to let other devices in the network know that they can be controlled.

HarmonySpan broadcasts SSDP messages as if it were a Roku device with External Control Protocol (ECP) support - this is how it's possible to add HarmonySpan to your Harmony Hub. The Harmony Hub sends ECP commands to a regular Roku to control it - but in HarmonySpan, we take those ECP commands, watch when they're triggered, and in turn trigger a webhook. This solution doesn't require a bluetooth keyboard or any special hardware emulation - we're talking over HTTP the whole way.

## See it in action
TwoGuyzTech // Control ANYTHING with your Logitech Harmony remote! | Trigger Webhooks from Sequences
https://www.youtube.com/watch?v=W59Ae5jUl2w

Build Montage // DIM & BRIGHTEN Your Cinema Lights With PAUSE & PLAY In Your Home Theater!
https://www.youtube.com/watch?v=Gqjma5_ZAYo
