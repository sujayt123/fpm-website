function objectRecover = reconstructImage(LEDgap, LEDheight, arraysize, wavelength, NA, spsize, imSeqLowRes)
    % Consider a row-major flattened version of the LED matrix.
    % xlocation represents the x-location of the nth element in the flattened array.
    xlocation = zeros(1, arraysize^2);
    % ylocation represents the y-location of the nth element in the flattened array.
    ylocation = zeros(1, arraysize^2);    
    for i=1:arraysize % from topleft to bottomright
        xlocation(1, 1 + arraysize *(i - 1):arraysize + arraysize*(i - 1)) = (-(arraysize - 1)/2:1:(arraysize - 1) / 2) * LEDgap;
        ylocation(1, 1 + arraysize *(i - 1):arraysize + arraysize*(i - 1)) =((arraysize - 1)/2 - (i - 1)) * LEDgap;
    end;
        
    % Compute the wavevector of the light emitted by each LED in the x and y directions.
    k0 = 2 * pi / wavelength;
    kx_relative = -sin(atan(xlocation/LEDheight));
    ky_relative = -sin(atan(ylocation/LEDheight));
    
    % Fs = 2*pi/spsize must be > 2 * max frequency in signal. So kmax for camera = pi/spsize.    
    kmax = pi/spsize;

    % Angular wavenumber components
    kx = k0 * kx_relative;
    ky = k0 * ky_relative;
    
    % Calculate cutoff frequency of lens.
    cutoffFrequency = NA * k0;

    % Calculate expected resolution of final image.
    delta_f = 2 * pi * LEDgap/LEDheight * 1 / wavelength;
    resolution_enhancement = (cutoffFrequency + (arraysize - 1) / 2 * delta_f) / cutoffFrequency;
    psize = spsize / resolution_enhancement;

    % Calculate size of final image in pixels based on expected resolution
    % improvement.
    [m1, n1] = size(imSeqLowRes(:,:,1));
    m = ceil((spsize / psize) * m1);
    n = ceil((spsize / psize) * n1);
    [kxm, kym] = meshgrid(-kmax:kmax / ((n1 - 1)/2):kmax, -kmax:kmax/((n1 - 1) / 2):kmax);
    CTF = ((kxm.^2+kym.^2)<cutoffFrequency^2); % Coherent Transfer function. 
    
    % Calculate spacing in frequency domain of one pixel to its neighbor in final image.
    dkx = 2 * pi / (psize * n);
    dky = 2 * pi / (psize * m);
    
    % recover the high resolution image
    seq = gseq(arraysize); % define the order of recovery, we start from the center (the 113th image) to the edge of the spectrum (the 225th image)
    objectRecover = ones(m, n); % initial guess of the object
    objectRecoverFT = fftshift(fft2(objectRecover));
    loop = 5;

    for tt=1:loop
        for i3=1:arraysize^2
            i2=seq(i3);
            kxc = round((n+1)/2+kx(1,i2)/dkx);
            kyc = round((m+1)/2+ky(1,i2)/dky); 
            kyl=round(kyc-(m1-1)/2);kyh=round(kyc+(m1-1)/2); 
            kxl=round(kxc-(n1-1)/2);kxh=round(kxc+(n1-1)/2);
            lowResFT = (m1/m)^2 * objectRecoverFT(kyl:kyh,kxl:kxh).*CTF; 
            im_lowRes = ifft2(ifftshift(lowResFT));
            im_lowRes = (m/m1)^2 *imSeqLowRes(:,:,i2).*exp(1i.*angle( im_lowRes)); 
            lowResFT=fftshift(fft2(im_lowRes)).*CTF;
            objectRecoverFT(kyl:kyh,kxl:kxh)=(1-CTF).*objectRecoverFT(kyl:kyh,kxl:kxh) + lowResFT;
        end;
    end;
    objectRecover=ifft2(ifftshift(objectRecoverFT));    
end