// src/__tests__/services/TalentProfileService.spec.js
import TalentProfileService from '@/services/TalentProfileService';
import axios from 'axios';
import { apiUrlTalentPool } from '@/constants/config';

// Mock axios instead of apiClient
jest.mock('axios');
const mockedAxios = axios;

describe('TalentProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTalentProfile', () => {
    it('should call axios with correct contractor endpoint', async () => {
      const mockResponse = { 
        data: { 
          data: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phoneNumber: '08123456789',
            photo: null,
            aboutMe: 'Software engineer',
            experienceYears: 5,
            skkLevel: 'Expert',
            currentLocation: 'Jakarta',
            preferredLocations: ['Jakarta', 'Bandung'],
            skill: 'Java, Spring Boot',
            price: 8500000
          },
          page: 0,
          size: 0,
          totalPages: 0,
          errors: null
        } 
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TalentProfileService.getTalentProfile('123');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${apiUrlTalentPool}/users/contractor/123`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(TalentProfileService.getTalentProfile('123')).rejects.toThrow('API Error');
    });
  });

  describe('getTalentExperiences', () => {
    it('should call axios with correct contractor experiences endpoint', async () => {
      const mockResponse = { 
        data: { 
          data: [
            {
              id: 1,
              title: 'Senior Software Engineer',
              company: 'PT Technology Solutions',
              companyImage: null,
              employmentType: 'FULL_TIME',
              startDate: '2020-01-15',
              endDate: '2023-12-31',
              location: 'Jakarta, DKI Jakarta',
              locationType: 'HYBRID'
            }
          ],
          page: 0,
          size: 0,
          totalPages: 0,
          errors: null
        } 
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TalentProfileService.getTalentExperiences('123');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${apiUrlTalentPool}/experiences/user/contractor/123`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(TalentProfileService.getTalentExperiences('123')).rejects.toThrow('API Error');
    });
  });

  describe('getTalentCertifications', () => {
    it('should call axios with correct contractor certificates endpoint', async () => {
      const mockResponse = { 
        data: { 
          data: [
            {
              id: 1,
              title: 'Java Professional Certification',
              file: 'java-cert.pdf',
              talentId: '123'
            }
          ],
          page: 0,
          size: 0,
          totalPages: 0,
          errors: null
        } 
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TalentProfileService.getTalentCertifications('123');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${apiUrlTalentPool}/certificates/user/contractor/123`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(TalentProfileService.getTalentCertifications('123')).rejects.toThrow('API Error');
    });
  });

  describe('getMockTalentProfile', () => {
    it('should return mock profile data with correct structure', async () => {
      const result = await TalentProfileService.getMockTalentProfile('123');

      expect(result).toEqual({
        data: {
          data: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe123@example.com',
            phoneNumber: '08123456799',
            photo: null,
            aboutMe: 'I am a passionate software engineer with 5 years of experience.',
            nik: '1234567890123469',
            npwp: '187654321098765',
            photoKtp: null,
            photoNpwp: null,
            photoIjazah: null,
            experienceYears: 5,
            skkLevel: 'Expert',
            currentLocation: 'Jakarta',
            preferredLocations: ['Jakarta', 'Bandung'],
            skill: 'Java, Spring Boot',
            price: 8500000
          },
          page: 0,
          size: 0,
          totalPages: 0,
          errors: null
        }
      });
    });
  });

  describe('getMockTalentExperiences', () => {
    it('should return mock experiences data with correct structure', async () => {
      const result = await TalentProfileService.getMockTalentExperiences('123');

      expect(result).toEqual({
        data: {
          data: [
            {
              id: 1,
              title: 'Senior Software Engineer',
              company: 'PT Technology Solutions',
              companyImage: null,
              employmentType: 'FULL_TIME',
              startDate: '2020-01-15',
              endDate: '2023-12-31',
              location: 'Jakarta, DKI Jakarta',
              locationType: 'HYBRID'
            },
            {
              id: 2,
              title: 'Backend Developer',
              company: 'PT Digital Innovation',
              companyImage: null,
              employmentType: 'CONTRACT',
              startDate: '2018-06-01',
              endDate: '2019-12-31',
              location: 'Bandung, West Java',
              locationType: 'ON_SITE'
            }
          ],
          page: 0,
          size: 0,
          totalPages: 0,
          errors: null
        }
      });
    });
  });

  describe('getMockTalentCertifications', () => {
    it('should return mock certifications data with correct structure', async () => {
      const result = await TalentProfileService.getMockTalentCertifications('123');

      expect(result).toEqual({
        data: {
          data: [
            {
              id: 1,
              title: 'Java Professional Certification',
              file: 'java-cert.pdf',
              talentId: '123'
            },
            {
              id: 2,
              title: 'Spring Boot Specialist',
              file: 'spring-boot-cert.pdf',
              talentId: '123'
            }
          ],
          page: 0,
          size: 0,
          totalPages: 0,
          errors: null
        }
      });
    });
  });

  describe('dummyDownloadCertificate', () => {
    it('should return blob data for download', async () => {
      const mockCert = { 
        id: 1, 
        title: 'Test Certificate', 
        file: 'test.pdf' 
      };
      
      const result = await TalentProfileService.dummyDownloadCertificate(mockCert);

      expect(result.data).toBeInstanceOf(Blob);
      expect(result.data.type).toBe('text/plain');
    });

    it('should simulate delay', async () => {
      const mockCert = { id: 1, title: 'Test', file: 'test.pdf' };
      const startTime = Date.now();
      
      await TalentProfileService.dummyDownloadCertificate(mockCert);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThan(450); // Should be at least 500ms delay
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle undefined talentId', async () => {
      const mockResponse = { data: { data: null } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(TalentProfileService.getTalentProfile(undefined)).resolves.toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${apiUrlTalentPool}/users/contractor/undefined`,
        expect.any(Object)
      );
    });

    it('should handle null talentId', async () => {
      const mockResponse = { data: { data: null } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(TalentProfileService.getTalentProfile(null)).resolves.toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${apiUrlTalentPool}/users/contractor/null`,
        expect.any(Object)
      );
    });

    it('should handle empty string talentId', async () => {
      const mockResponse = { data: { data: null } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(TalentProfileService.getTalentProfile('')).resolves.toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${apiUrlTalentPool}/users/contractor/`,
        expect.any(Object)
      );
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Network timeout');
      timeoutError.code = 'TIMEOUT';
      mockedAxios.get.mockRejectedValue(timeoutError);

      await expect(TalentProfileService.getTalentProfile('123')).rejects.toThrow('Network timeout');
    });

    it('should handle 500 server errors', async () => {
      const serverError = new Error('Internal server error');
      serverError.response = { status: 500 };
      mockedAxios.get.mockRejectedValue(serverError);

      await expect(TalentProfileService.getTalentProfile('123')).rejects.toThrow('Internal server error');
    });

    it('should handle malformed responses gracefully', async () => {
      const malformedResponse = { };
      mockedAxios.get.mockResolvedValue(malformedResponse);

      const result = await TalentProfileService.getTalentProfile('123');
      expect(result).toEqual(malformedResponse);
    });
  });
});