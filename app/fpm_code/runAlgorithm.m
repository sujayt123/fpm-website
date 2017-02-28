function objectRecover = runAlgorithm(dirName, LEDgap, LEDheight, arraysize, wavelength, NA, spsize)
    structFiles = dir(strcat(dirName, '/*.png'));
    fileNames = {structFiles.name};
    dimensions = size(imread(strcat(dirName, '/', char(fileNames(1)))));
    xlength = dimensions(1);
    ylength=  dimensions(1);
    imSeqLowRes = zeros(xlength, ylength, length(fileNames));
    
    % load exposure times into memory.
    %load('exposureTimes.mat');
    %exposureTimes_flattened = reshape(exposureTimes.',1,[]);
    
    % for now arraysize = 7 has been hardcoded into the exposure scaling.
    for i = 1: length(fileNames)
        sampleImg = imread(strcat(dirName, '/', char(fileNames(i))));
        % no need to resize if already a square
        imSeqLowRes(:, :, i) = rgb2gray(sampleImg); %./ (exposureTimes_flattened(i) / exposureTimes_flattened(ceil(fileNames / 2)));        
    end    
    
    % Create an image mosaic corresponding to the LED vector's raw input
    % images. These have been scaled by exposure times.
    % imgCell = cell(7, 7);
    % for iImg = 1:49
    %   imgCell{iImg} = imresize(imSeqLowRes(:,:,iImg) .* (255 / max(max(imSeqLowRes(iImg)))), [100 100]);         
    %end
    
    %bigImage = (cell2mat(imgCell'));
    %imshow(bigImage, []);
    
    
    
    objectRecover = reconstructImage(LEDgap, LEDheight, arraysize, wavelength, NA, spsize, imSeqLowRes);
	imwrite(uint8(abs(objectRecover).*(255 / max(max(abs(objectRecover))))), [dirName '.result.png'])
end 