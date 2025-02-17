const checkUserName = require('./your-file-name'); // Thay 'your-file-name' bằng tên file của bạn
const sql = require('mssql');

// Mock connection pool và request
jest.mock('mssql', () => {
    const mssql = jest.fn();
    mssql.VarChar = jest.fn(); // Mock VarChar type
    return mssql;
});

describe('checkUserName', () => {
    let mockPool;

    beforeEach(() => {
        // Tạo mock pool và request trước mỗi test case
        mockPool = {
            request: jest.fn(() => ({
                input: jest.fn(() => ({
                    query: jest.fn(),
                })),
            })),
        };
        global.pool = mockPool; // Gán mock pool vào global
    });

    it('should return user data if user exists', async () => {
        const mockUser = { UserName: 'plinhneee', Email: 'plinhneee@gmail.com', Phone: '0123123123' };
        mockPool.request().input().query.mockResolvedValue({ recordset: [mockUser] });

        const user = await checkUserName('plinhneee');
        expect(user).toEqual(mockUser);
        expect(mockPool.request().input).toHaveBeenCalledWith('account', sql.VarChar, 'plinhneee'); // Kiểm tra input được gọi đúng
        expect(mockPool.request().input().query).toHaveBeenCalled(); // Kiểm tra query được gọi
    });

    it('should return undefined if user does not exist', async () => {
        mockPool.request().input().query.mockResolvedValue({ recordset: [] });

        const user = await checkUserName('nonexistentuser');
        expect(user).toBeUndefined();
        expect(mockPool.request().input).toHaveBeenCalledWith('account', sql.VarChar, 'nonexistentuser'); // Kiểm tra input được gọi đúng
        expect(mockPool.request().input().query).toHaveBeenCalled(); // Kiểm tra query được gọi
    });

    it('should handle errors gracefully', async () => {
        const errorMessage = 'Database connection error';
        mockPool.request().input().query.mockRejectedValue(new Error(errorMessage));
        console.log = jest.fn(); // Mock console.log để kiểm tra lỗi được log

        const user = await checkUserName('plinhneee');
        expect(user).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith('Error', new Error(errorMessage)); // Kiểm tra lỗi được log
    });

    it('should handle special characters in account name', async () => {
        const mockUser = { UserName: 'test.user', Email: 'test@example.com', Phone: '1234567890' };
        mockPool.request().input().query.mockResolvedValue({ recordset: [mockUser] });

        const user = await checkUserName('test.user');
        expect(user).toEqual(mockUser);
        expect(mockPool.request().input).toHaveBeenCalledWith('account', sql.VarChar, 'test.user');
        expect(mockPool.request().input().query).toHaveBeenCalled();
    });
});