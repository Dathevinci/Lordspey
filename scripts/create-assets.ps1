Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Sunle\.gemini\antigravity\brain\5f27337f-b885-4589-b156-9f42cb98c07a\.user_uploaded\media_1790277439260.jpg"
$srcImg = [System.Drawing.Image]::FromFile($srcPath)

$assetsDir = "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\assets"
$buildDir = "C:\Users\Sunle\.gemini\antigravity\scratch\inkwell\build"

if (-not (Test-Path $assetsDir)) { New-Item -ItemType Directory -Path $assetsDir -Force }
if (-not (Test-Path $buildDir)) { New-Item -ItemType Directory -Path $buildDir -Force }

# 1. assets/logo.png: High-resolution full original image in PNG format
$logoBmp = New-Object System.Drawing.Bitmap($srcImg)
$logoPngPath = Join-Path $assetsDir "logo.png"
$logoBmp.Save($logoPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$logoBmp.Dispose()
Write-Host "Created $logoPngPath"

# 2. Square Icon 512x512 with circular medallion framing on dark background
$iconSize = 512
$iconBmp = New-Object System.Drawing.Bitmap($iconSize, $iconSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Clear with deep obsidian
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 8, 8, 10))
$g.FillRectangle($bgBrush, 0, 0, $iconSize, $iconSize)

# Subtle background crimson ambient radial glow
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(20, 20, 472, 472)
$pbg = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$pbg.CenterColor = [System.Drawing.Color]::FromArgb(65, 239, 68, 68)
$pbg.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 8, 8, 10))
$g.FillPath($pbg, $glowPath)
$pbg.Dispose()
$glowPath.Dispose()

# Circular badge bounds
$circleMargin = 20
$circleSize = $iconSize - ($circleMargin * 2) # 472
$badgePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$badgePath.AddEllipse($circleMargin, $circleMargin, $circleSize, $circleSize)

# Clip to circle
$g.SetClip($badgePath)

# Cover scaling: scale to fill circle width and height seamlessly
$scale = [Math]::Max([double]$circleSize / $srcImg.Width, [double]$circleSize / $srcImg.Height)
$targetW = [int]($srcImg.Width * $scale)
$targetH = [int]($srcImg.Height * $scale)
# Center horizontally and offset vertically so the raven's head & glowing butterfly chest are perfectly centered
$targetX = [int]($circleMargin + ($circleSize - $targetW) / 2)
$targetY = [int]($circleMargin + ($circleSize - $targetH) * 0.38)

$g.DrawImage($srcImg, $targetX, $targetY, $targetW, $targetH)

# Reset clipping
$g.ResetClip()

# Draw glowing outer rings around the medallion
$outerGlowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 239, 68, 68), 8)
$g.DrawEllipse($outerGlowPen, $circleMargin, $circleMargin, $circleSize, $circleSize)
$outerGlowPen.Dispose()

$innerRingPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 239, 68, 68), 3)
$g.DrawEllipse($innerRingPen, $circleMargin, $circleMargin, $circleSize, $circleSize)
$innerRingPen.Dispose()

# Accent star at the top of the ring
$font = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
$starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString([char]0x2726, $font, $starBrush, [float]($iconSize / 2), 4, $sf)
$sf.Dispose()
$starBrush.Dispose()
$font.Dispose()

$badgePath.Dispose()
$bgBrush.Dispose()
$g.Dispose()

$iconPngPath = Join-Path $assetsDir "icon.png"
$iconBmp.Save($iconPngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$buildIconPngPath = Join-Path $buildDir "icon.png"
$iconBmp.Save($buildIconPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Created $iconPngPath and $buildIconPngPath"

$iconBmp.Dispose()
$srcImg.Dispose()
