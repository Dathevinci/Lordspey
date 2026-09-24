Add-Type -AssemblyName System.Drawing

function Create-IcoFromPng($sourcePngPath, $outputIcoPath, $sizes) {
  $srcImg = [System.Drawing.Image]::FromFile($sourcePngPath)
  $streams = @()
  $entries = @()
  
  foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $s, $s)
    $g.Dispose()
    
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    
    $streams += $ms
  }
  $srcImg.Dispose()
  
  $fs = [System.IO.File]::Create($outputIcoPath)
  $bw = New-Object System.IO.BinaryWriter($fs)
  
  # ICO Header
  $bw.Write([uint16]0) # Reserved
  $bw.Write([uint16]1) # Type: 1 = Icon
  $bw.Write([uint16]$sizes.Count) # Count
  
  # Directory entries: 6 bytes header + 16 bytes per entry
  $offset = 6 + ($sizes.Count * 16)
  
  for ($i = 0; $i -lt $sizes.Count; $i++) {
    $s = $sizes[$i]
    $dataLen = [int]$streams[$i].Length
    $wByte = if ($s -ge 256) { 0 } else { [byte]$s }
    $hByte = if ($s -ge 256) { 0 } else { [byte]$s }
    
    $bw.Write([byte]$wByte)        # Width
    $bw.Write([byte]$hByte)       # Height
    $bw.Write([byte]0)            # Color count
    $bw.Write([byte]0)            # Reserved
    $bw.Write([uint16]1)          # Color planes
    $bw.Write([uint16]32)         # Bits per pixel
    $bw.Write([uint32]$dataLen)   # Size of image data
    $bw.Write([uint32]$offset)    # Offset
    
    $offset += $dataLen
  }
  
  # Write image streams
  for ($i = 0; $i -lt $sizes.Count; $i++) {
    $bytes = $streams[$i].ToArray()
    $bw.Write($bytes)
    $streams[$i].Dispose()
  }
  
  $bw.Close()
  $fs.Close()
  Write-Host "Created ICO: $outputIcoPath with sizes: $($sizes -join ', ')"
}

$iconPng = "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\assets\icon.png"
$sizes = @(256, 128, 64, 48, 32, 16)

Create-IcoFromPng $iconPng "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\assets\icon.ico" $sizes
Create-IcoFromPng $iconPng "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\assets\logo.ico" $sizes
Create-IcoFromPng $iconPng "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\build\icon.ico" $sizes
Create-IcoFromPng $iconPng "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\assets\favicon.ico" @(48, 32, 16)
