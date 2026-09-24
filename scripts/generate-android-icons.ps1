Add-Type -AssemblyName System.Drawing

$iconPng = "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\assets\icon.png"
$srcImg = [System.Drawing.Image]::FromFile($iconPng)

$densities = @(
  @{ folder = "mipmap-mdpi"; size = 48 },
  @{ folder = "mipmap-hdpi"; size = 72 },
  @{ folder = "mipmap-xhdpi"; size = 96 },
  @{ folder = "mipmap-xxhdpi"; size = 144 },
  @{ folder = "mipmap-xxxhdpi"; size = 192 }
)

$resDir = "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\android\app\src\main\res"

foreach ($d in $densities) {
  $targetDir = Join-Path $resDir $d.folder
  if (Test-Path $targetDir) {
    $bmp = New-Object System.Drawing.Bitmap($d.size, $d.size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $d.size, $d.size)
    $g.Dispose()

    $p1 = Join-Path $targetDir "ic_launcher.png"
    $p2 = Join-Path $targetDir "ic_launcher_round.png"
    $bmp.Save($p1, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($p2, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Updated Android $($d.folder) ($($d.size)x$($d.size))"
  }
}

$srcImg.Dispose()
